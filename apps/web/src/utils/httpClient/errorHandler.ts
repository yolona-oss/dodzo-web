import { Store } from "@reduxjs/toolkit";
import { authUserLogout } from "../../redux/features/auth/authSlice";
import { newNotify } from "../../redux/features/notify/notifySlice";
import { getRefreshToken } from "../cookies";

function logError(error: any, store: Store) {
    if (error.response) {
        const { error: respMessage, feedback: respFeedback } = error.response.data;

        const DEFAULTMSG = "Something's not right:( Try again later.";
        let notificationMsg = respFeedback || respMessage || DEFAULTMSG;

        const hasRefreshToken = Boolean(getRefreshToken());
        if (error.response.status === 401 && !hasRefreshToken) {
            console.log("Logouting user due to 401 error");
            notificationMsg = "You need to Log In";

            store.dispatch(authUserLogout());
        }

        // store.dispatch(
        //     newNotify({
        //         title: "Network Error",
        //         description: notificationMsg,
        //         variant: error.response.status,
        //     })
        // );
    }
    else if (error.request) {
        if (error?.code === "ERR_NETWORK") {
            (window as any).NetworkError = error?.code;
        }

        // store.dispatch(
        //     newNotify({
        //         title: "Network Error",
        //         description: "Something's not right:( Try again later.",
        //         variant: "error",
        //     })
        // );
    }
    else {
        // store.dispatch(
        //     newNotify({
        //         title: "Network Error",
        //         description: "Something's not right:( Try again later.",
        //         variant: "error",
        //     })
        // );
    }
}

export default logError;
