export interface AuthorDto {
    id: string;
    name: string;
}

export interface GenreDto {
    id: string;
    name: string;
}

export interface BookDto {
    id: string;
    title: string;
    genre?: GenreDto | null;
    authorsIds?: string[] | { $values: string[] };
}
