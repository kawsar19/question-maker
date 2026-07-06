import Editor from "./components/Editor";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-2.5 py-4 sm:px-4 sm:py-8 lg:py-12 dark:bg-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 sm:gap-6">
        <header className="flex flex-col gap-2 px-1 sm:px-0">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
            Question Maker
          </h1>
        </header>

        <Editor />
      </div>
    </main>
  );
}
