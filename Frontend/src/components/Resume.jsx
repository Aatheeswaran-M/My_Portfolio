export default function Resume({ resume }) {
  if (!resume) return null;

  return (
    <section className="my-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Resume</h2>
      <a
        href={resume.resumeUrl}
        target="_blank"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download Resume
      </a>
    </section>
  );
}
