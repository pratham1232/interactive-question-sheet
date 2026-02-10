export const fetchSheet = async () => {
  const res = await fetch(
    "https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet"
  );

  if (!res.ok) throw new Error("API failed");

  const json = await res.json();
  const topics = json.data.sheet.topics || [];

  // Normalize API → App format
  return topics.map((t) => ({
    id: t._id,
    title: t.name,
    subTopics: (t.sub_topics || []).map((s) => ({
      id: s._id,
      title: s.name,
      questions: (s.questions || []).map((q) => ({
        id: q._id,
        title: q.title,
      })),
    })),
  }));
};
