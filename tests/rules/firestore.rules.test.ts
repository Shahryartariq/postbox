// Security-rules tests. They need the official Firestore emulator (Java):
//   pnpm test:rules
// CI runs them on every push (.github/workflows/ci.yml).
import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-whisperbox-rules",
    firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8080 },
  });
});

afterAll(() => env.cleanup());
beforeEach(() => env.clearFirestore());

const db = (uid: string) => env.authenticatedContext(uid).firestore() as unknown as Firestore;
const anon = () => env.unauthenticatedContext().firestore() as unknown as Firestore;

function askBatch(f: Firestore, uid: string, id: string, data: Record<string, unknown> = {}) {
  const b = writeBatch(f);
  b.set(doc(f, "questions", id), {
    text: "Who loves me?",
    ownerUid: uid,
    open: true,
    createdAt: serverTimestamp(),
    ...data,
  });
  b.set(doc(f, "limits", uid), { lastQuestionAt: serverTimestamp() }, { merge: true });
  return b;
}

function replyBatch(f: Firestore, uid: string, qid: string, data: Record<string, unknown> = {}) {
  const b = writeBatch(f);
  b.set(doc(collection(f, "questions", qid, "replies")), {
    text: "Your mom",
    createdAt: serverTimestamp(),
    ...data,
  });
  b.set(doc(f, "limits", uid), { lastReplyAt: serverTimestamp() }, { merge: true });
  return b;
}

/** Seeds a question owned by `owner` without going through the rules. */
async function seedQuestion(id = "abcd2345", owner = "owner", open = true) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const f = ctx.firestore() as unknown as Firestore;
    await setDoc(doc(f, "questions", id), {
      text: "Who loves me?",
      ownerUid: owner,
      open,
      createdAt: new Date(),
    });
    await setDoc(doc(f, "questions", id, "replies", "r1"), {
      text: "Someone does",
      createdAt: new Date(),
    });
  });
}

describe("questions", () => {
  it("lets a signed-in browser create a question", async () => {
    await assertSucceeds(askBatch(db("alice"), "alice", "abcd2345").commit());
  });

  it("rejects a question without the rate-limit stamp", async () => {
    const f = db("alice");
    await assertFails(
      setDoc(doc(f, "questions", "abcd2345"), {
        text: "Who loves me?",
        ownerUid: "alice",
        open: true,
        createdAt: serverTimestamp(),
      }),
    );
  });

  it("rejects bad questions", async () => {
    const f = db("alice");
    await assertFails(askBatch(f, "alice", "abcd2345", { ownerUid: "bob" }).commit());
    await assertFails(askBatch(f, "alice", "abcd2345", { text: "x".repeat(201) }).commit());
    await assertFails(askBatch(f, "alice", "abcd2345", { text: "   " }).commit());
    await assertFails(askBatch(f, "alice", "abcd2345", { open: false }).commit());
    await assertFails(askBatch(f, "alice", "abcd2345", { extra: 1 }).commit());
    await assertFails(askBatch(f, "alice", "ABCD2345").commit());
    await assertFails(askBatch(anon(), "nobody", "abcd2345").commit());
  });

  it("rate-limits a second question right after the first", async () => {
    const f = db("alice");
    await assertSucceeds(askBatch(f, "alice", "abcd2345").commit());
    await assertFails(askBatch(f, "alice", "efgh2345").commit());
  });

  it("is readable by anyone, but only the owner can list theirs", async () => {
    await seedQuestion();
    await assertSucceeds(getDoc(doc(anon(), "questions", "abcd2345")));
    await assertSucceeds(
      getDocs(query(collection(db("owner"), "questions"), where("ownerUid", "==", "owner"))),
    );
    await assertFails(getDocs(collection(db("bob"), "questions")));
  });

  it("only the owner can close, and only `open` can change", async () => {
    await seedQuestion();
    await assertFails(updateDoc(doc(db("bob"), "questions", "abcd2345"), { open: false }));
    await assertSucceeds(updateDoc(doc(db("owner"), "questions", "abcd2345"), { open: false }));
    await assertFails(updateDoc(doc(db("owner"), "questions", "abcd2345"), { text: "edited" }));
  });

  it("only the owner can delete it", async () => {
    await seedQuestion();
    await assertFails(deleteDoc(doc(db("bob"), "questions", "abcd2345")));
    await assertSucceeds(deleteDoc(doc(db("owner"), "questions", "abcd2345")));
  });
});

describe("replies", () => {
  it("anyone can read the wall", async () => {
    await seedQuestion();
    await assertSucceeds(getDocs(collection(anon(), "questions", "abcd2345", "replies")));
  });

  it("lets anyone signed in answer anonymously", async () => {
    await seedQuestion();
    await assertSucceeds(replyBatch(db("bob"), "bob", "abcd2345").commit());
  });

  it("rejects replies that identify the author or skip the stamp", async () => {
    await seedQuestion();
    const f = db("bob");
    await assertFails(replyBatch(f, "bob", "abcd2345", { authorUid: "bob" }).commit());
    await assertFails(replyBatch(f, "bob", "abcd2345", { text: "x".repeat(501) }).commit());
    await assertFails(
      setDoc(doc(collection(f, "questions", "abcd2345", "replies")), {
        text: "no stamp",
        createdAt: serverTimestamp(),
      }),
    );
  });

  it("rejects replies to closed or missing questions", async () => {
    await seedQuestion("abcd2345", "owner", false);
    await assertFails(replyBatch(db("bob"), "bob", "abcd2345").commit());
    await assertFails(replyBatch(db("bob"), "bob", "zzzz2345").commit());
  });

  it("rate-limits one browser but not another", async () => {
    await seedQuestion();
    await assertSucceeds(replyBatch(db("bob"), "bob", "abcd2345").commit());
    await assertFails(replyBatch(db("bob"), "bob", "abcd2345").commit());
    await assertSucceeds(replyBatch(db("carol"), "carol", "abcd2345").commit());
  });

  it("only the question owner can delete an answer; nobody can edit one", async () => {
    await seedQuestion();
    await assertFails(deleteDoc(doc(db("bob"), "questions", "abcd2345", "replies", "r1")));
    await assertFails(
      updateDoc(doc(db("owner"), "questions", "abcd2345", "replies", "r1"), { text: "edited" }),
    );
    await assertSucceeds(deleteDoc(doc(db("owner"), "questions", "abcd2345", "replies", "r1")));
  });
});

describe("limits", () => {
  it("are private to each browser and can't be backdated", async () => {
    await assertSucceeds(
      setDoc(doc(db("alice"), "limits", "alice"), { lastReplyAt: serverTimestamp() }),
    );
    await assertFails(getDoc(doc(db("bob"), "limits", "alice")));
    await assertFails(setDoc(doc(db("bob"), "limits", "bob"), { lastReplyAt: new Date(0) }));
  });
});
