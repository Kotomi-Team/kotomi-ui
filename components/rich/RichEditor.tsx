import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style/zh-cn.less'

export const RichEditor = (props: any) => {
    return (
        <ReactQuill
            style={{
                height: '100%',
            }}
            modules={{
                toolbar: [
                    [{
                        size: [],
                    }],
                    [{
                        align: [],
                    },
                        'direction',
                    ],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{
                        color: [],
                    }, {
                        background: [],
                    }],
                    [{
                        script: 'super',
                    }, {
                        script: 'sub',
                    }],
                    ['blockquote', 'code-block'],
                    [{
                        list: 'ordered',
                    }, {
                        list: 'bullet',
                    }, {
                        indent: '-1',
                    }, {
                        indent: '+1',
                    }],
                    ['link', 'image', 'video'],
                    ['clean'],
                ],
            }} {...props}
        />
    )
};
