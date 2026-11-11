import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-10">
      <h1 className="text-4xl font-extrabold">There&apos;s no question at this link.</h1>
      <p className="mt-3 text-haze">
        Check that you copied the whole link, or ask the person who shared it to send it again.
      </p>
      <Link href="/" className="mt-6 inline-block font-bold text-blush underline underline-offset-4">
        Ask your own question
      </Link>
    </div>
  );
}
