const commentHandler = async (event) => {
    event.preventDefault();

    const comment = document.querySelector('#comment-txt').value.trim();
    const id = document.querySelector('#comment-btn').getAttribute('data-id');

    if (comment) {
        const response = await fetch(`api/blogs/${id}/comments`, {
            method: 'POST',
            body: JSON.stringify({ comment }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.querySelector('#comment-txt').value = '';
            const newComment = await response.json();

            // Create a new div element for the comment
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');

            commentDiv.innerHTML = `
          <p>${comment}</p>
          <p>Posted by ${comment.name} on ${new Date().toLocaleString()}</p>
        `;
            // Append the comment div to the "comments" section
            const commentsSection = document.querySelector('.comments');
            commentsSection.appendChild(commentDiv);

            alert('Comment successful');
        } else {
            alert('Failed to add comment');
        }
    }
};
document
    .querySelector('.comment-form')
    .addEventListener('submit', commentHandler);

