import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './newsEditor.css'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
// import htmlToDraft from 'html-to-draftjs';
export default function NewsEditor(props) {
    const { getContent, content } = props

    useEffect(() => {
        // console.log(content);
        const html = content
        if (html === undefined) {//防止创建新闻有错误，对空的html进行转换
            return undefined
        }
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [content])

    const [editorState, setEditorState] = useState('')
    return (
        <div>
            <Editor
                editorState={editorState}//受控
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) =>
                    setEditorState(editorState)
                }
                onBlur={() => {
                    getContent(
                        draftToHtml(convertToRaw(editorState.getCurrentContent()))
                    );
                }}

            />
        </div>
    );
}

