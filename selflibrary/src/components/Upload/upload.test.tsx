import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import axios from 'axios';
import { render, RenderResult, fireEvent, waitFor, createEvent } from '@testing-library/react';
import { Upload, UploadProps } from './upload';

//mock icon的实现，主要是上传列表中的图标，这里把 iconProps显示成恩子
jest.mock('../Icon/icon', () => {
    return ({ icon, onClick }) => {
        return <span onClick={onClick}>{icon}</span>
    }
})
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const testProps: UploadProps = {
    action: 'fakeurl.com',
    onSuccess: jest.fn(),
    onChange: jest.fn(),
    onRemove: jest.fn(),
    drag: true,
}
//wrapper是最外层的结果，fileInput是隐藏的input，uploadArea是点击触发的区域
let wrapper: RenderResult, fileInput: HTMLInputElement, uploadArea: HTMLElement;
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' });

describe('test upload component', () => {
    beforeEach(() => {
        wrapper = render(<Upload {...testProps}>Click to upload</Upload>);
        fileInput = wrapper.container.querySelector('.file-input') as HTMLInputElement;
        uploadArea = wrapper.queryByText('Click to upload') as HTMLElement;
        mockedAxios.post.mockResolvedValue({ 'data': 'cool' });
    })
    it('upload process should works fine', async () => {
        const { queryByText } = wrapper;
        // mockedAxios.post.mockImplementation(() => {
        //     return Promise.resolve({ 'data': 'cool' })
        // });
        // mockedAxios.post.mockResolvedValue({ 'data': 'cool' });//简单方法
        expect(uploadArea).toBeInTheDocument();
        expect(fileInput).not.toBeVisible();
        fireEvent.change(fileInput, { target: { files: [testFile] } });
        expect(queryByText('spinner')).toBeInTheDocument();
        await waitFor(() => {
            expect(queryByText('test.png')).toBeInTheDocument();
        });
        expect(queryByText('check-circle')).toBeInTheDocument();
        expect(testProps.onSuccess).toHaveBeenCalledWith('cool', testFile);
        expect(testProps.onChange).toHaveBeenCalledWith(testFile);

        //remove uploaded file
        expect(queryByText('times')).toBeInTheDocument();
        fireEvent.click(queryByText('times') as HTMLElement);
        expect(queryByText('test.png')).not.toBeInTheDocument();
        expect(testProps.onRemove).toHaveBeenCalledWith(expect.objectContaining({
            raw: testFile,
            status: 'success',
            name: 'test.png'
        }))
    })
    it('drag and drop file should works fine', async () => {
        fireEvent.dragOver(uploadArea);
        expect(uploadArea).toHaveClass('is-dragover');
        fireEvent.dragLeave(uploadArea);
        expect(uploadArea).not.toHaveClass('is-dragover');
        // fireEvent.drop(uploadArea, { dataTransfer: { file: [testFile] } });
        const mockDropEvent = createEvent.drop(uploadArea);
        Object.defineProperty(mockDropEvent, "dataTransfer", {
            value: {
                files: [testFile]
            }
        })
        fireEvent(uploadArea, mockDropEvent);
        await waitFor(() => {
            expect(wrapper.queryByText('test.png')).toBeInTheDocument();
        });
        expect(testProps.onSuccess).toHaveBeenCalledWith('cool', testFile);
    })
})
