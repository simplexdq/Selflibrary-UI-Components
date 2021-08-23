import React from "react";
import { ComponentMeta } from '@storybook/react';
import { Upload, UploadFile } from './upload';
import { action } from '@storybook/addon-actions';
import Icon from "../Icon/icon";

// const defaultFileList: UploadFile[] = [
//     { uid: '123', size: 1234, name: 'hello.md', status: 'uploading', percent: 30 },
//     { uid: '122', size: 1234, name: 'xyz.md', status: 'success', percent: 30 },
//     { uid: '121', size: 1234, name: 'eyiha.md', status: 'error', percent: 30 }
// ]
// const checkFileSize = (file: File) => {
//     if (Math.round(file.size / 1024) > 50) {
//         alert('file too big');
//         return false;
//     }
//     return true;
// }

// const filePromise = (file: File) => {
//     const newFile = new File([file], 'new_name.png', { type: file.type })
//     return Promise.resolve(newFile)
// }
export const SimpleUpload = () => {
    return (
        <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            // onProgress={action('progress')}
            // onSuccess={action('success')}
            // onError={action('error')}
            onChange={action('changed')}
            onRemove={action('removed')}
            // defaultFileList={defaultFileList}
            // beforeUpload={filePromise}
            name="fileName"
            data={{ 'key': 'value' }}
            headers={{ 'X-Powered-By': 'daisy' }}
            accept=".png"
            multiple
            drag
        >
            <Icon icon="upload" size="5x" theme="secondary" />
            <br />
            <p>Drag file over to upload</p>
        </Upload>
    )
}

export default {
    title: 'Components/Upload',
    component: SimpleUpload,
} as ComponentMeta<typeof Upload>;