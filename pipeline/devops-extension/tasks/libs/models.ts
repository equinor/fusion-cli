export interface App {
    key:           string;
    name:          string;
    version:       string;
    shortName:     string;
    description:   string;
    publishedDate: string;
    tags:          any[];
    order:         number;
    type:          string;
    accentColor:   string;
    icon:          string;
    categoryId:    string;
    category:      AppCategory;
    owners:        any[];
    admins:        any[];
}

export interface AppCategory {
    id:          string;
    name:        string;
    color:       string;
    defaultIcon: string;
}

