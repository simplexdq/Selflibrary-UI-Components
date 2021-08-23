import React, { ChangeEvent, FC, useRef, useState } from "react";
import axios from "axios";
import UploadList from "./uploadList";
// import Button from "../Button/button";
import Dragger from "./dragger";


export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error';

export interface UploadFile {
    uid: string;
    size: number;
    name: string;
    status?: UploadFileStatus;
    percent?: number;
    raw?: File;
    response?: any;
    error?: any;
}

export interface UploadProps {
    action: string;//发送到哪个接口
    defaultFileList?: UploadFile[];
    beforeUpload?: (file: File) => boolean | Promise<File>;
    onProgress?: (percentage: number, file: File) => void;
    onSuccess?: (data: any, file: File) => void;
    onError?: (err: any, file: File) => void;
    onChange?: (file: File) => void;
    onRemove?: (file: UploadFile) => void;
    headers?: { [key: string]: any };
    name?: string;
    data?: { [key: string]: any };
    withCredentials?: boolean;
    accept?: string;
    multiple?: boolean;
    drag?: boolean;
}

export const Upload: FC<UploadProps> = (props) => {
    const {
        action,
        defaultFileList,
        beforeUpload,
        onProgress,
        onSuccess,
        onError,
        onChange,
        onRemove,
        name,
        headers,
        data,
        withCredentials,
        accept,
        multiple,
        children,
        drag,
    } = props
    const fileInput = useRef<HTMLInputElement>(null);
    const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || []);
    const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
        setFileList(prevList => {
            return prevList.map(file => {
                if (file.uid === updateFile.uid) {
                    return { ...file, ...updateObj }
                } else {
                    return file
                }
            })
        })
    }

    // const handleClick = () => {
    //     if (fileInput.current) {
    //         fileInput.current.click()
    //     }
    // }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) {
            return
        }
        uploadFiles(files);
        //上传完后把fileInput清空
        if (fileInput.current) {
            fileInput.current.value = ''
        }
    }
    const handleRemove = (file: UploadFile) => {
        setFileList((prevList => {
            return prevList.filter(item => item.uid !== file.uid)
        }));
        if (onRemove) {
            onRemove(file);
        }
    }
    const uploadFiles = (files: FileList) => {
        //FileList是类数组，我们想要调用数组的方法，所以先将其转换成数组
        let postFiles = Array.from(files);
        postFiles.forEach(file => {
            if (!beforeUpload) {
                post(file)
            } else {
                const result = beforeUpload(file)
                if (result && result instanceof Promise) {
                    result.then(processedFile => {
                        post(processedFile)
                    })
                } else if (result !== false) {
                    post(file)
                }
            }
        })
    }
    const post = (file: File) => {
        let _file: UploadFile = {
            uid: Date.now() + 'upload-file',
            status: 'ready',
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file
        }
        // setFileList([_file, ...fileList])//bug：上传多个文件，却只显示上传了一个；原因：在多次调用post函数时，fileList还没有更新到最新的，所以最后只剩下最后一个file，所以采用回调函数的方式
        setFileList(prevList => {
            return [_file, ...prevList];
        })
        const formData = new FormData();
        formData.append(name || 'file', file);
        if (data) {
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            })
        }
        axios.post(action, formData, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data'
            },
            withCredentials,
            onUploadProgress: (e) => {
                let percentage = Math.round((e.loaded * 100) / e.total) || 0;
                if (percentage < 100) {
                    updateFileList(_file, { percent: percentage, status: 'uploading' })
                    if (onProgress) {
                        onProgress(percentage, file)
                    }
                }
            }
        }).then(res => {
            // console.log(res);
            updateFileList(_file, { status: 'success', response: res.data })
            if (onSuccess) {
                onSuccess(res.data, file)
            }
            if (onChange) {
                onChange(file)
            }
        }).catch(err => {
            // console.log(err);
            updateFileList(_file, { status: 'error', error: err })
            if (onError) {
                onError(err, file)
            }
            if (onChange) {
                onChange(file)
            }
        })
    }
    console.log(fileList)

    return (
        <div className="upload-component">
            {/* <Button btnType="primary" onClick={handleClick}>
                Upload
            </Button> */}
            {drag ?
                <Dragger onFile={(files) => { uploadFiles(files) }}>
                    {children}
                </Dragger>
                : children
            }
            <input
                className="file-input"
                style={{ display: "none" }}
                ref={fileInput}
                onChange={handleFileChange}
                type="file"
                accept={accept}
                multiple={multiple}
            />
            <UploadList
                fileList={fileList}
                onRemove={handleRemove}
            />
        </div>
    )
}

Upload.defaultProps = {
    name: 'file'
}

export default Upload;