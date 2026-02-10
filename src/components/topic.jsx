import { useState } from "react";
import useSheetStore from "../store/sheetStore";
import { Droppable, Draggable } from "@hello-pangea/dnd";

// 1. Rename 'topic' to 'topicProp' in the arguments to avoid the declaration error
export default function Topic({ topic: topicProp, isOpen, onToggle, solvedFilter }) {

    /* ======================
       STORE DATA & ACTIONS
    ====================== */
    // 2. This selector ensures the UI updates the SECOND a sub-topic is added
    const topic = useSheetStore((state) =>
        state.topics.find((t) => t.id === topicProp.id)
    );

    const {
        toggleQuestion,
        editTopic,
        deleteTopic,
        addSubTopic,
        deleteSubTopic,
        addQuestion,
        deleteQuestion,
        editSubTopic,
        editQuestion,
    } = useSheetStore();

    /* ======================
       LOCAL STATE
    ====================== */
    const [subTitle, setSubTitle] = useState("");
    const [questionInputs, setQuestionInputs] = useState({});
    const [editingTopic, setEditingTopic] = useState(false);
    const [editingTopicTitle, setEditingTopicTitle] = useState("");

    const [confirmTopic, setConfirmTopic] = useState(false);
    const [editingSubId, setEditingSubId] = useState(null);
    const [editingSubTitle, setEditingSubTitle] = useState("");
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editingQuestionTitle, setEditingQuestionTitle] = useState("");

    // 3. CRITICAL: Add the missing handler functions
    const handleSave = (e) => {
        if (e) e.stopPropagation();
        if (!editingTopicTitle.trim()) return;
        editTopic(topic.id, editingTopicTitle.trim());
        setEditingTopic(false);
    };

    const handleCancel = (e) => {
        if (e) e.stopPropagation();
        setEditingTopic(false);
    };

    // 4. CRITICAL: Prevent crash if topic is deleted or not found
    if (!topic) return null;

    return (
        <div className="card mb-3 shadow-sm">
            {/* TOPIC HEADER */}
            <div
                className="card-header d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={onToggle}
            >
                <div className="flex-grow-1">
                    {editingTopic ? (
                        <div className="d-flex gap-2 w-100" onClick={(e) => e.stopPropagation()}>
                            <input
                                className="form-control form-control-sm"
                                value={editingTopicTitle}
                                onChange={(e) => setEditingTopicTitle(e.target.value)}
                                autoFocus
                            />
                            <button className="btn btn-sm btn-success" onClick={handleSave}>✓</button>
                            <button className="btn btn-sm btn-secondary" onClick={handleCancel}>✕</button>
                        </div>
                    ) : (
                        <span className="fw-bold">{topic.title}</span>
                    )}
                </div>

                <div className="d-flex gap-2 ms-3">
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingTopic(true);
                            setEditingTopicTitle(topic.title);
                        }}
                    >
                        ✏️
                    </button>

                    {confirmTopic ? (
                        <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-success" onClick={(e) => { e.stopPropagation(); deleteTopic(topic.id); }}>✔</button>
                            <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); setConfirmTopic(false); }}>✖</button>
                        </div>
                    ) : (
                        <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); setConfirmTopic(true); }}>🗑</button>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="card-body">
                    {/* ADD SUB-TOPIC SECTION */}
                    <div className="d-flex gap-2 mb-3">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="New sub-topic"
                            value={subTitle}
                            onChange={(e) => setSubTitle(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!subTitle.trim()) return;
                                addSubTopic(topic.id, subTitle.trim());
                                setSubTitle(""); // This now works because 'topic' is reactive
                            }}
                        >
                            ➕
                        </button>
                    </div>

                    {/* SUB-TOPICS LIST */}
                    <Droppable droppableId={`subtopics-${topic.id}`} type="SUBTOPIC">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {topic.subTopics.map((sub, subIndex) => (
                                    <Draggable key={sub.id} draggableId={sub.id} index={subIndex}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} className="mb-4 ms-2 card p-2 bg-light">
                                                <div className="d-flex justify-content-between align-items-center mb-2" {...provided.dragHandleProps}>
                                                    {editingSubId === sub.id ? (
                                                        <div className="d-flex gap-2 w-100">
                                                            <input
                                                                className="form-control form-control-sm"
                                                                value={editingSubTitle}
                                                                onChange={(e) => setEditingSubTitle(e.target.value)}
                                                                autoFocus
                                                            />
                                                            <button className="btn btn-sm btn-success" onClick={() => { editSubTopic(topic.id, sub.id, editingSubTitle); setEditingSubId(null); }}>✓</button>
                                                            <button className="btn btn-sm btn-secondary" onClick={() => setEditingSubId(null)}>✕</button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <h6 className="fw-bold mb-0 text-primary">{sub.title}</h6>
                                                            <div className="d-flex gap-2">
                                                                <button className="btn btn-xs btn-link p-0" onClick={() => { setEditingSubId(sub.id); setEditingSubTitle(sub.title); }}>✏️</button>
                                                                <button className="btn btn-xs btn-link p-0 text-danger" onClick={() => deleteSubTopic(topic.id, sub.id)}>🗑</button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                {/* QUESTIONS LIST */}
                                                <Droppable droppableId={`questions-${sub.id}`} type="QUESTION">
                                                    {(provided) => (
                                                        <ul ref={provided.innerRef} {...provided.droppableProps} className="list-unstyled ms-3">
                                                            {sub.questions
                                                                .filter(q => solvedFilter === "all" ? true : solvedFilter === "solved" ? q.solved : !q.solved)
                                                                .map((q, qIndex) => (
                                                                    <Draggable key={q.id} draggableId={q.id} index={qIndex}>
                                                                        {(provided) => (
                                                                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="d-flex align-items-center gap-2 mb-1 border-bottom pb-1">
                                                                                <input type="checkbox" checked={q.solved} onChange={() => toggleQuestion(topic.id, sub.id, q.id)} />
                                                                                {editingQuestionId === q.id ? (
                                                                                    <div className="d-flex gap-1 w-100">
                                                                                        <input className="form-control form-control-sm" value={editingQuestionTitle} onChange={(e) => setEditingQuestionTitle(e.target.value)} autoFocus />
                                                                                        <button className="btn btn-sm btn-success" onClick={() => { editQuestion(topic.id, sub.id, q.id, editingQuestionTitle); setEditingQuestionId(null); }}>✓</button>
                                                                                    </div>
                                                                                ) : (
                                                                                    <>
                                                                                        <span className={`flex-grow-1 small ${q.solved ? 'text-decoration-line-through text-muted' : ''}`}>{q.title}</span>
                                                                                        <button className="btn btn-xs btn-link p-0" onClick={() => { setEditingQuestionId(q.id); setEditingQuestionTitle(q.title); }}>✏️</button>
                                                                                        <button className="btn btn-xs btn-link p-0 text-danger" onClick={() => deleteQuestion(topic.id, sub.id, q.id)}>✕</button>
                                                                                    </>
                                                                                )}
                                                                            </li>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                            {provided.placeholder}
                                                        </ul>
                                                    )}
                                                </Droppable>

                                                <div className="d-flex gap-2 ms-3 mt-2">
                                                    <input
                                                        className="form-control form-control-sm"
                                                        placeholder="Add question..."
                                                        value={questionInputs[sub.id] || ""}
                                                        onChange={(e) => setQuestionInputs({ ...questionInputs, [sub.id]: e.target.value })}
                                                    />
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => { if(!questionInputs[sub.id]) return; addQuestion(topic.id, sub.id, questionInputs[sub.id]); setQuestionInputs({...questionInputs, [sub.id]: ""}); }}>➕</button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </div>
    );
}