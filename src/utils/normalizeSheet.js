export function normalizeSheetData(rawQuestions) {
  const topicMap = {};

  rawQuestions.forEach((q) => {
    const topicName = q.topic || "Others";
    const subTopicName = q.subTopic || "General";

    // Create topic
    if (!topicMap[topicName]) {
      topicMap[topicName] = {
        id: topicName,
        title: topicName,
        subTopics: {},
      };
    }

    // Create subtopic
    if (!topicMap[topicName].subTopics[subTopicName]) {
      topicMap[topicName].subTopics[subTopicName] = {
        id: subTopicName,
        title: subTopicName,
        questions: [],
      };
    }

    // Add question
    topicMap[topicName].subTopics[subTopicName].questions.push({
      id: q._id,
      title: q.title,
      difficulty: q.questionId?.difficulty,
      platform: q.questionId?.platform,
      link: q.questionId?.problemUrl,
      solved: q.isSolved,
    });
  });

  // Convert maps → arrays
  return Object.values(topicMap).map((topic) => ({
    ...topic,
    subTopics: Object.values(topic.subTopics),
  }));
}
