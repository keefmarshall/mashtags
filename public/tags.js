function doError(status, e) {
    if (!e) {
        e = "status " + status
    }
    document.getElementById("error").innerText = "An error occurred: " + e
}


async function deleteTag(tag) {
    try {
        response = await fetch(`/app/tags/${tag}`, {
            method: "DELETE"
        })
        if (!response.ok) {
            console.error("Error: response status " + response.status)
            doError(response.status)
        } else {
            console.log("Deleted tag " + tag)
            document.getElementById("tag-item-" + tag).remove()
        }
    } catch (e) {
        console.error(e)
        doError("0", e)
    }
}

async function deleteTagEventHandler() {
    // button IDs are tag-button-<name>
    tagName = this.id.substring("tag-button-".length)
    await deleteTag(tagName)
}

function initTags() {
    document.querySelectorAll("#tags-container button").forEach(button => {
        button.addEventListener("click", deleteTagEventHandler)
    })
}

initTags()
