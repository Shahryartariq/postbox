import { AskForm } from "@/components/ask-form";
import { MyQuestions } from "@/components/my-questions";

export default function Home() {
  return (
    <>
      <h1 className="max-w-2xl text-5xl font-extrabold leading-[0.95] tracking-tight [font-variation-settings:'wdth'_78] sm:text-7xl">
        Ask anything. Read what people really think.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-haze">
        Write a question and share the link. Answers land on your wall as people send them.
        Nobody signs up, and no names are attached.
      </p>
      <div className="mt-10">
        <AskForm />
      </div>
      <MyQuestions />
    </>
  );
}
