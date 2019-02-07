export class RetryHelper {

    sendFile(params, retries = 10, promise = null) {
        // console.log("SENDING FILE: ", retries, "attempts remaining", params)

        if (retries > 0) {
            //     return this._sendFile(params)
            //         .then(() => {
            //             // Upload Success
            //             console.log("Upload Success!")
            //             return Promise.resolve(true)
            //         })
            //         .catch((err) => {
            //             console.log("Upload Fail", err)

            //             this.exportStatus.retries++

            //             return this.sendFile(params, --retries) // <-- The important part
            //         })
        } else {
            console.log("Failed 3 times!!!")

            //     this.exportStatus.errors.push({
            //         message: "A file failed to upload after 3 attempts.",
            //         params: params
            //     })

            //     return Promise.resolve(false)

        }

    }
}