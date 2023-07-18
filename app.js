const form = document.getElementById('commentForm');
const input = document.getElementById('comment');
const usernameInput = document.getElementById('username');
const main = document.querySelector('.main');
const commentList = document.getElementById('commentList');

/*
1. create comment
------------
*/
function createComment() {
    const comment = document.createElement('li');
    const username = document.createElement('span');
    username.textContent = usernameInput.value;
    username.className = 'username';

    const commentText = document.createElement('span');
    commentText.textContent = input.value;
    commentText.className = 'comment-text';

    const timestamp = document.createElement('span');
    const date = new Date();
    const timestampText = document.createTextNode(`${date.toLocaleString()}`);
    timestamp.appendChild(timestampText);
    timestamp.className = 'timer';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'edit';
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'delete';

    comment.appendChild(username);
    comment.appendChild(commentText);
    comment.appendChild(timestamp);
    comment.appendChild(editBtn);
    comment.appendChild(deleteBtn);
    comment.setAttribute('data-timestamp', date.getTime()); // Add timestamp as data attribute
    comment.setAttribute('data-username', usernameInput.value); // Add username as data attribute

    return comment;
}


form.addEventListener('submit', (event) => {
    event.preventDefault();

    const comment = createComment();

    if (input.value === '') {
        alert('Enter a comment!!!');
    } else {
        commentList.insertBefore(comment, commentList.firstChild);
    }
    input.value = '';
    usernameInput.value = '';
    saveData();
});


/*
2. Button actions
-----------------
*/

commentList.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const button = event.target;
        const li = button.parentNode;
        const ul = li.parentNode;
        if (button.textContent === 'delete') {
            ul.removeChild(li);
            saveData();
        } else if (button.textContent === 'edit') {
            const commentText = li.querySelector('.comment-text');
            const existingText = commentText.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = existingText;
            input.className = 'comment-input';

            li.insertBefore(input, commentText);
            li.removeChild(commentText);
            button.textContent = 'save';
            saveData();
        } else if (button.textContent === 'save') {
            const input = li.querySelector('.comment-input');
            const commentText = document.createElement('span');
            commentText.textContent = input.value;
            commentText.className = 'comment-text';
            li.insertBefore(commentText, input);
            li.removeChild(input);
            button.textContent = 'edit';
            saveData();
        }
    }
});


/*
3. Add Sorting based on the time
----------------------
*/

const filterSelect = document.querySelector('#filterSelect');

// Function to sort the list items by timestamp
function sortByTimestamp(order) {
    const listItems = Array.from(commentList.children);
    const sortedListItems = listItems.sort((a, b) => {
        const timestampA = parseInt(a.getAttribute('data-timestamp'));
        const timestampB = parseInt(b.getAttribute('data-timestamp'));

        if (order === 'newestFirst') {
            return timestampB - timestampA;
        } else if (order === 'oldestFirst') {
            return timestampA - timestampB;
        }
    });
    sortedListItems.forEach(comment => commentList.appendChild(comment));
}

// Event listener for the filter select
filterSelect.addEventListener('change', (event) => {
    const filterValue = event.target.value;
    if (filterValue === 'newestFirst') {
        sortByTimestamp('newestFirst');
    } else if (filterValue === 'oldestFirst') {
        sortByTimestamp('oldestFirst');
    }
    saveData();
});

/*
4. Storing data in LocalStorage
----------------------
*/
function saveData() {
    localStorage.setItem('data', commentList.innerHTML);
}

function showTask() {
    commentList.innerHTML = localStorage.getItem('data');
}

showTask();