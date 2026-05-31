/**
 * MAIN CONTROLLER HOOK: useMenuManager
 * * Instead of having one giant file with 500 lines of code, useMenuManager.js
 * imports smaller, specialized "feature" hooks. It passes the necessary data
 * between them so they can stay in sync.
 */
import {useMenuManagerState} from "@/lib/useMenuManager_state";
import {useMenuManagerSync} from "@/lib/useMenuManager_sync";
import {useMenuManagerActions} from "@/lib/useMenuManager_actions";
import {useMenuManagerFiles} from "@/lib/useMenuManager_files";

/**
 * * - States: It starts by calling useMenuManagerState() to create the
 *     "source of truth" (your data for menus, news, and home).
 *   - Synchronization: It passes those states into useMenuManagerSync(states)
 *     so the synchronization logic knows what to save to the cloud or load from local storage.
 *   - Actions & Files: It passes the data and the "setter" functions (like setMenuData)
 *     to the Action and File hooks so they have the authority to modify the data.
 */

export const useMenuManager = () => {
    const states = useMenuManagerState();
    const { mounted } = useMenuManagerSync(states);
    const actions = useMenuManagerActions(
        states.menuData, states.setMenuData,
        states.newsData, states.setNewsData,
        states.setFooterData, states.setHomeData
    );
    const files = useMenuManagerFiles(states);

    return {
        mounted,
        ...states,
        ...actions,
        ...files,
        updateFooter: states.setFooterData,
        logic: {
            t: states.t,
            footerData: states.footerData
        }
    };
};