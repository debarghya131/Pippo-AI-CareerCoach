"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => {
  return (
    <div className="cover-letter-preview-shell overflow-hidden rounded-lg border py-4">
      <MDEditor value={content} preview="preview" height={640} />
    </div>
  );
};

export default CoverLetterPreview;
