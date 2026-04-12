import Editor from "./components/Editor";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Question Maker
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            A rich-text editor built with Next.js, Tailwind CSS, and Tiptap v3.
          </p>
        </header>

        <Editor />
      </div>
    </main>
  );
}
