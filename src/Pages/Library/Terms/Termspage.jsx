import React from "react";
import { useParams } from "react-router-dom";

import Sidenav from "../../../Components/Sidenav";
import LibraryButtons from "../LibraryButtons";
import Termslist from "./Termslist";

import Lessonlist from "../../../Components/lessonList"; // Ensure consistent casing
import Lessons from "../../../Components/dataLessons";
import LessonTerms from "../../Library/Terms/LessonTerms";

function Termspage() {
    const { termId } = useParams();
    const lesson = Lessons[termId]; // Get lesson details
    const terms = LessonTerms[termId] || []; // Get correct terms for this lesson

    return (
        <div className="termspage-content">
            {lesson ? <Lessonlist Lessons={lesson} /> : <h1>No Data Found</h1>}
            <Sidenav />
            <LibraryButtons />
            <Termslist OneTerms={terms} /> {/* Now dynamically loads correct terms */}
        </div>
    );
}

export default Termspage;

