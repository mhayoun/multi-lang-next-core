export const createNewMenu = () => ({
    id: Date.now(),
    title: {he: '', en: ''},
    bgImage: '',
    subItems: []
});

export const createNewSubMenu = () => ({
    id: Date.now(),
    title: {he: '', en: ''},
    content: {he: '', en: ''},
    images: [],
    pdfs: [],
    linkedItemIds: []
});

export const createNewNews = () => ({
    id: Date.now(),
    title: {he: '', en: ''},
    bgImage_mob: '',
    bgImage_web: '',
    content: { he: '', en: '' },
    images: [],
    pdfs: [],
    linkedItemIds: []
});

export const LANGUAGES = {
    en: {
        dir: 'ltr',
        label: 'English',
        switch: 'Admin Panel',
        user: 'User View',
        back: 'Back',
        docsTitle: 'Documents & Files'
    },
    he: {
        dir: 'rtl',
        label: 'עברית',
        switch: 'פאנל ניהול',
        user: 'תצוגת משתמש',
        back: 'חזור',
        docsTitle: 'מסמכים וקבצים'
    }
};