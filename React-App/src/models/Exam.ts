import { TopicType } from "./Topic";
import { UserType } from "./User"

 


export type ExamType = {
    id: number,
    userId: number |undefined,
    examName: string,
    examType: string,
    topicName: string,
    folderId: number|null,
    topic:TopicType,
    sharing: boolean,
    modified: string,
    examPath: string,
}
export type ExamFolderType={
    id: number,
    folderName: string,
    type: 'folder',
    parentId?: number;
    children?: (ExamFileType | ExamFolderType)[]; 
}
export type ExamFileType = ExamType & {
    parentId?: number;
    type: 'file' | 'folder';
}

export type StudentExamType = ExamType & {
    studentDetails: UserType | null;
    grade?: number | undefined;
    evaluation?: string;
};

