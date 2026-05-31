//This file handles the heavy lifting of image compression
// and Vercel Blob uploads/deletions.

import imageCompression from 'browser-image-compression';

export const useMenuManagerFiles = (states) => {
    const {setMenuData, setNewsData, setLogo, setHomeData, menuData, newsData, homeData} = states;

    const handleFileUpload = async (e, targetId, subId, type, isNews = false, isHome = false) => {
        const files = Array.from(e.target.files);

        for (let file of files) {
            try {
                if (file.type.startsWith('image/') && file.size > 1024 * 1024) {
                    if (window.confirm(`Compress "${file.name}"?`)) {
                        const options = {maxSizeMB: 0.9, maxWidthOrHeight: 1920, useWebWorker: true};
                        const compressedBlob = await imageCompression(file, options);
                        file = new File([compressedBlob], file.name, {type: file.type});
                    } else continue;
                }

                const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                    method: 'POST',
                    body: file,
                });

                const responseData = response.headers.get("content-type")?.includes("application/json")
                    ? await response.json()
                    : await response.text();

                if (!response.ok) throw new Error(responseData?.error || "Upload failed");

                const fileUrl = responseData.url;

                if (isHome) {
                    setHomeData(prev => ({...prev, [type]: [...(prev[type] || []), fileUrl]}));
                    continue;
                }

                const setter = isNews ? setNewsData : setMenuData;
                setter(prev => prev.map(item => {
                    if (item.id !== targetId) return item;
                    if (!subId && ['bgImage', 'image', 'logo'].includes(type)) {
                        if (type === 'logo') setLogo(fileUrl);
                        return {...item, [type]: fileUrl};
                    }
                    const fileEntry = type === 'pdfs' ? {url: fileUrl, name: file.name} : fileUrl;
                    if (isNews) return {...item, [type]: [...(item[type] || []), fileEntry]};

                    return {
                        ...item,
                        subItems: item.subItems.map(s => s.id === subId ? {
                            ...s,
                            [type]: [...(s[type] || []), fileEntry]
                        } : s)
                    };
                }));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const removeFile = async (targetId, subId, type, index, isNews = false, isHome = false) => {

        // 1. Identification de l'URL à supprimer
        let urlToDelete = null;

        if (isHome) {
            urlToDelete = homeData[type]?.[index];
        } else {
            const currentData = isNews ? newsData : menuData;
            const targetItem = currentData.find(item => item.id === targetId);

            if (isNews) {
                const fileObj = targetItem?.[type]?.[index];
                urlToDelete = typeof fileObj === 'string' ? fileObj : fileObj?.url;
            } else {
                const subItem = targetItem?.subItems?.find(s => s.id === subId);
                const fileObj = subItem?.[type]?.[index];
                urlToDelete = typeof fileObj === 'string' ? fileObj : fileObj?.url;
            }
        }

        if (!urlToDelete) {
            console.error("❌ Could not find URL in state.");
            return;
        }

        // 2. Tentative de suppression sur le Cloud (Vercel Blob)
        try {
            const response = await fetch(`/api/blob/delete?url=${encodeURIComponent(urlToDelete)}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Cloud deletion failed');
            console.log("✅ Vercel Blob deleted");
        } catch (error) {
            console.warn("⚠️ Cloud deletion issue, removing from UI anyway:", error.message);
        }

        // 3. Mise à jour de l'état LOCAL (UI)

        // CAS A : Mise à jour de la Home (Galerie)
        if (isHome) {
            setHomeData(prev => {
                const newList = [...(prev[type] || [])];
                newList.splice(index, 1); // Retire l'élément du tableau
                return {
                    ...prev,
                    [type]: newList
                };
            });
            return; // On s'arrête ici pour la Home
        }

        // CAS B : Mise à jour des Menus ou News
        const setter = isNews ? setNewsData : setMenuData;
        setter(prev => prev.map(item => {
            if (item.id !== targetId) return item;

            if (isNews) {
                const newList = [...(item[type] || [])];
                newList.splice(index, 1);
                return {...item, [type]: newList};
            }

            return {
                ...item,
                subItems: (item.subItems || []).map(s => {
                    if (s.id !== subId) return s;
                    const newList = [...(s[type] || [])];
                    newList.splice(index, 1);
                    return {...s, [type]: newList};
                })
            };
        }));
    };

    return {handleFileUpload, removeFile};
};