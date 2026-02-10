import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useSheetStore from "../store/sheetStore";
import Topic from "../components/topic";

export default function Home() {
  const { topics, setTopics, addTopic } = useSheetStore();
  /* ======================
   EXPORT SHEET
====================== */
  const exportSheet = () => {
    const dataStr = JSON.stringify(topics, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "question-sheet-progress.json";
    a.click();

    URL.revokeObjectURL(url);
  };
  /* ======================
     IMPORT SHEET
  ====================== */
  const importSheet = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (!Array.isArray(data)) {
          alert("Invalid sheet format");
          return;
        }

        setTopics(data);
      } catch {
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };
  const [solvedFilter, setSolvedFilter] = useState("all");


  /* ======================
     EXPAND / COLLAPSE STATE
  ====================== */
  const [openTopics, setOpenTopics] = useState({});

  const [newTopic, setNewTopic] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // "all" | "solved" | "unsolved"

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  /* ======================
     GLOBAL PROGRESS LOGIC
  ====================== */
  const totalQuestions = topics.reduce(
    (sum, t) =>
      sum +
      t.subTopics.reduce(
        (s, sub) => s + sub.questions.length,
        0
      ),
    0
  );

  const solvedQuestions = topics.reduce(
    (sum, t) =>
      sum +
      t.subTopics.reduce(
        (s, sub) =>
          s + sub.questions.filter((q) => q.solved).length,
        0
      ),
    0
  );

  const percent =
    totalQuestions === 0
      ? 0
      : Math.round((solvedQuestions / totalQuestions) * 100);

  /* ======================
     APPLY THEME
  ====================== */
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ======================
     FILTERED TOPICS
  ====================== */
  const filteredTopics = topics
    .map((topic) => {
      const filteredSubTopics = topic.subTopics
        .map((sub) => {
          const filteredQuestions = sub.questions.filter((q) => {
            if (statusFilter === "solved") return q.solved;
            if (statusFilter === "unsolved") return !q.solved;
            return true;
          });

          return {
            ...sub,
            questions: filteredQuestions,
          };
        })
        .filter((sub) => sub.questions.length > 0);

      const matchesSearch =
        topic.title.toLowerCase().includes(search.toLowerCase()) ||
        filteredSubTopics.some((sub) =>
          sub.title.toLowerCase().includes(search.toLowerCase())
        );

      return matchesSearch
        ? { ...topic, subTopics: filteredSubTopics }
        : null;
    })
    .filter(Boolean);



  return (
    <div className="container py-4">
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="fw-bold">Question Sheet</h1>

        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              const allOpen = {};
              topics.forEach((t) => (allOpen[t.id] = true));
              setOpenTopics(allOpen);
            }}
          >
            Expand All
          </button>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setOpenTopics({})}
          >
            Collapse All
          </button>

          <button
            className="btn btn-outline-success btn-sm"
            onClick={exportSheet}
          >
            ⬇ Export
          </button>

          <label className="btn btn-outline-warning btn-sm mb-0">
            ⬆ Import
            <input
              type="file"
              accept=".json"
              hidden
              onChange={importSheet}
            />
          </label>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

      </div>

      {/* ======================
   GLOBAL PROGRESS
====================== */}
      <div className="mb-4">
        <div className="progress mb-1">
          <div
            className="progress-bar"
            style={{ width: `${percent}%` }}
          />
        </div>

        <small className="text-muted">
          {solvedQuestions}/{totalQuestions} solved ({percent}%)
        </small>
      </div>

      {/* ================= ADD + SEARCH ================= */}
      <div className="card mb-4 p-3">
        <div className="row g-2">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Enter topic name"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <button
              className="btn btn-primary w-100"
              onClick={() => {
                if (!newTopic.trim()) return;
                addTopic(newTopic.trim());
                setNewTopic("");
              }}
            >
              ➕ Add Topic
            </button>
          </div>

          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select w-auto"
              value={solvedFilter}
              onChange={(e) => setSolvedFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>

          </div>

        </div>
      </div>

      {/* ================= DRAG & DROP ================= */}
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;

          const items = Array.from(topics);
          const [moved] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, moved);
          setTopics(items);
          if (result.type === "SUBTOPIC") {
            const topicId = result.source.droppableId.replace("subtopics-", "");
            reorderSubTopics(topicId, result.source.index, result.destination.index);
          }

          if (result.type === "QUESTION") {
            const subId = result.source.droppableId.replace("questions-", "");
            const topic = topics.find((t) =>
              t.subTopics.some((s) => s.id === subId)
            );
            reorderQuestions(
              topic.id,
              subId,
              result.source.index,
              result.destination.index
            );
          }
          if (result.type === "SUBTOPIC") {
            reorderSubTopics(result.source, result.destination);
          }

          if (result.type === "QUESTION") {
            reorderQuestions(result.source, result.destination);
          }

        }}

      >
        <Droppable droppableId="topics">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {filteredTopics.map((topic, index) => (
                <Draggable
                  key={topic.id}
                  draggableId={topic.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-3"
                    >
                      <Topic
                        topic={topic}
                        solvedFilter={solvedFilter}
                        isOpen={openTopics[topic.id]}
                        onToggle={() =>
                          setOpenTopics((p) => ({
                            ...p,
                            [topic.id]: !p[topic.id],
                          }))
                        }
                      />



                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}

              {filteredTopics.length === 0 && (
                <p className="text-muted text-center mt-4">
                  No topics found
                </p>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
