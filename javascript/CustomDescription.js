const comments = [
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
  {
    userName: "민지경민",
    content: "디자인이 좀 치네요.",
  },
];

function createComment(comment) {
  const postComment = document.createElement("div");
  postComment.className = "commentItem";

  const userNameElement = document.createElement("div");
  userNameElement.className = "commentUser";
  userNameElement.textContent = comment.userName;
  postComment.append(userNameElement);

  const contentElement = document.createElement("div");
  contentElement.className = "commentContent";
  contentElement.textContent = comment.content;
  postComment.append(contentElement);

  console.log(postComment);
  return postComment;
}

function main() {
  console.log("main");
  const commentContainer = document.querySelector(".commentList");
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    const newComment = createComment(comment);
    commentContainer.append(newComment);
  }
}

main();
