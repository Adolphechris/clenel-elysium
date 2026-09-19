export type EducationLevel = 'PRIMAIRE' | 'CTEB' | 'HUMANITES' | 'SUPERIEUR';
export type ResourceFormat = 'PDF' | 'EPUB' | 'AUDIO_MP3' | 'VIDEO_MP4' | 'HTML_BUNDLE' | 'INTERACTIVE_WIDGET';
export type OerLicense = 'CC-BY-4.0' | 'CC-BY-SA-4.0' | 'CC-BY-NC-4.0' | 'PUBLIC_DOMAIN_RDC';
export interface OerResource {
    resourceId: string;
    title: string;
    discipline: string;
    level: EducationLevel;
    filiere?: string;
    author: string;
    publisher: string;
    license: OerLicense;
    format: ResourceFormat;
    fileUrl: string;
    fileSizeBytes: number;
    checksumSha256: string;
    curriculumAligned: boolean;
    tags: string[];
    downloadableOffline: boolean;
    publishedAtUTC: string;
}
export interface ResourceSearchQuery {
    discipline?: string;
    level?: EducationLevel;
    format?: ResourceFormat;
    maxSizeBytes?: number;
    keyword?: string;
}
