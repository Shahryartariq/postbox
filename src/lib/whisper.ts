import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type FirestoreError,
  type Timestamp,
} from "firebase/firestore";
import { customAlphabet } from "nanoid";
import { firebase } from "./firebase";
import { ID_ALPHABET } from "./limits";

const newId = customAlphabet(ID_ALPHABET, 8);

export type Question = {
  id: string;
  text: string;
  ownerUid: string;
  open: boolean;
  createdAt: Date | null;
};

export type Reply = {
  id: string;
  text: string;
  createdAt: Date | null;
};

const toDate = (t: unknown) => (t ? (t as Timestamp).toDate() : null);

/**
 * Creates a question. The batch also stamps limits/{uid}, which the security
 * rules use to rate-limit question creation.
 */
export async function createQuestion(uid: string, text: string): Promise<string> {
  const { db } = firebase();
  const id = newId();
  const batch = writeBatch(db);
  batch.set(doc(db, "questions", id), {
    text: text.trim(),
    ownerUid: uid,
    open: true,
    createdAt: serverTimestamp(),
  });
  batch.set(doc(db, "limits", uid), { lastQuestionAt: serverTimestamp() }, { merge: true });
  await batch.commit();
  return id;
}

/** Adds an anonymous reply. No user id is stored on the reply. */
export async function addReply(uid: string, questionId: string, text: string) {
  const { db } = firebase();
  const batch = writeBatch(db);
  batch.set(doc(collection(db, "questions", questionId, "replies")), {
    text: text.trim(),
    createdAt: serverTimestamp(),
  });
  batch.set(doc(db, "limits", uid), { lastReplyAt: serverTimestamp() }, { merge: true });
  await batch.commit();
}

export function watchQuestion(
  id: string,
  onData: (q: Question | null) => void,
  onError: (e: FirestoreError) => void,
) {
  const { db } = firebase();
  return onSnapshot(
    doc(db, "questions", id),
    (snap) => {
      if (!snap.exists()) return onData(null);
      const d = snap.data({ serverTimestamps: "estimate" });
      onData({
        id: snap.id,
        text: d.text,
        ownerUid: d.ownerUid,
        open: d.open,
        createdAt: toDate(d.createdAt),
      });
    },
    onError,
  );
}

export function watchReplies(
  questionId: string,
  onData: (replies: Reply[]) => void,
  onError: (e: FirestoreError) => void,
) {
  const { db } = firebase();
  const q = query(
    collection(db, "questions", questionId, "replies"),
    orderBy("createdAt", "desc"),
    limit(300),
  );
  return onSnapshot(
    q,
    (snap) =>
      onData(
        snap.docs.map((r) => {
          const d = r.data({ serverTimestamps: "estimate" });
          return { id: r.id, text: d.text, createdAt: toDate(d.createdAt) };
        }),
      ),
    onError,
  );
}

/** Questions created from this browser (its anonymous account). */
export function watchMyQuestions(
  uid: string,
  onData: (qs: Question[]) => void,
  onError: (e: FirestoreError) => void,
) {
  const { db } = firebase();
  return onSnapshot(
    query(collection(db, "questions"), where("ownerUid", "==", uid)),
    (snap) => {
      const qs = snap.docs.map((s) => {
        const d = s.data({ serverTimestamps: "estimate" });
        return {
          id: s.id,
          text: d.text,
          ownerUid: d.ownerUid,
          open: d.open,
          createdAt: toDate(d.createdAt),
        };
      });
      qs.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
      onData(qs);
    },
    onError,
  );
}

export async function setQuestionOpen(id: string, open: boolean) {
  const { db } = firebase();
  await updateDoc(doc(db, "questions", id), { open });
}

export async function deleteReply(questionId: string, replyId: string) {
  const { db } = firebase();
  await deleteDoc(doc(db, "questions", questionId, "replies", replyId));
}

/** Deletes every reply, then the question itself. */
export async function deleteQuestion(id: string) {
  const { db } = firebase();
  const replies = await getDocs(collection(db, "questions", id, "replies"));
  for (let i = 0; i < replies.docs.length; i += 400) {
    const batch = writeBatch(db);
    replies.docs.slice(i, i + 400).forEach((r) => batch.delete(r.ref));
    await batch.commit();
  }
  await deleteDoc(doc(db, "questions", id));
}
