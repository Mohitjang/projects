const loadCommentsBtnElement = document.getElementById("load-comments-btn");
const commentsSectionElement = document.getElementById("comments");
const formElement = document.querySelector("#comments-form form");
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text");

function createCommentList(comments) {
  // now we have to create ol element:
  // now we have create li for every comment
  const commentListElement = document.createElement("ol");
  for (const comment of comments) {
    const commentListItemElement = document.createElement("li");
    commentListItemElement.innerHTML = `
      <article class="comment-item">
        <h2>${comment.title}</h2>
        <p>${comment.text}</p>
      </article>
    `;
    // after creating li append this li in ol:-
    commentListElement.appendChild(commentListItemElement);
  }
  return commentListElement;
}

async function fetchCommentsForPost() {
  // XMLHttpRequest :- we can use this as well
  // axios :- and also we can use third party lib as well like
  // fetch() :- we will use fetch built in method in js, and parse the url on which we want tosend the get request:-
  // because fetch function by default sends a get request:-
  const postId = loadCommentsBtnElement.dataset.postid;

  try {
    const response = await fetch(`/posts/${postId}/comments`);

    if (!response.ok) {
      alert("fetching comments fails, maybe on server something is wrong!");
      return;
    }
    const responseData = await response.json();
    //   console.log(responseData);

    if (responseData && responseData.length > 0) {
      const commentsListElements = createCommentList(responseData);
      commentsSectionElement.innerHTML = "";
      commentsSectionElement.appendChild(commentsListElements);
    } else {
      commentsSectionElement.firstElementChild.textContent =
        "We could not find any comments. Maybe add one?";
    }
  } catch (error) {
    alert(
      "Could not send request - maybe check you network or try again later!"
    );
  }
}

// now we will post comment using ajax fetch api:-
async function saveComment(event) {
  event.preventDefault();
  const postId = formElement.dataset.postid;
  const commentTitle = commentTitleElement.value;
  const commentText = commentTextElement.value;
  const comment = { title: commentTitle, text: commentText };
  //   console.log(comment);
  // now we have to use fetch api for calling the post api on the server:-
  // for sending the data in encoded form of json we need to convert data into stringify:-

  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      fetchCommentsForPost();
    } else {
      alert("could not send comments");
    }
  } catch (error) {
    alert(
      "Could not send request - maybe check you network or try again later!"
    );
  }
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);

formElement.addEventListener("submit", saveComment);
