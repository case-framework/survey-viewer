import { Dialog, DialogBtn, FileDropzone } from 'case-web-ui';
import React, { useEffect, useState } from 'react';
import { acceptJSON } from './constants';

interface UploadDialogProps {
    open: boolean;
    onClose: () => void;
    onReady: (file: File) => void;
}

const UploadDialog: React.FC<UploadDialogProps> = (props) => {
    const [selectedFile, setSelectedFile] = useState<File | undefined>();

    useEffect(() => {
        if (!props.open) {
            setSelectedFile(undefined);
        }
    }, [props.open])

    return (
        <Dialog
            title="File picker"
            open={props.open}
            onClose={props.onClose}
            ariaLabelledBy="title"
        >
            <div className="px-3 py-2a">
                <p>Select a JSON files:</p>
                {props.open ? <FileDropzone
                    accept={acceptJSON}
                    placeholderText="Select a file"
                    maxFiles={1}
                    onDrop={(files) => {
                        if (files.length > 0) {
                            setSelectedFile(files[0]);
                        }
                    }}
                /> : null}
                <DialogBtn
                    className="mt-2 me-2"
                    type="button"
                    color="primary"
                    outlined={true}
                    label={"Cancel"}
                    onClick={() => props.onClose()}
                />
                <button
                    className="btn btn-primary mt-2"
                    disabled={!selectedFile}
                    onClick={() => {
                        if (!selectedFile) {
                            return;
                        }
                        props.onReady(selectedFile);
                        props.onClose();
                    }}
                >
                    Open
                </button>
            </div>
        </Dialog>
    );
};

export default UploadDialog;
