import { UserType } from "./User"

export type ExamType = {
    id: number,
    userId: number | undefined,
    examName: string,
    topicName: string,
    // gradeId: number,
    sharing: boolean,
    modified: string,
    teacherId: number | undefined,
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

