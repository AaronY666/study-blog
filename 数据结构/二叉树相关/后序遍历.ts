
function postTraversal(node) {
    if (!node) {
        return;
    }
    postTraversal(node.left);
    postTraversal(node.right);
    console.log(node);
}

function postTraversal2(node) {
    if (!node) {
        return;
    }

    let stack = []
    while (node || stack.length) {
        while (node) {
            stack.push(node);
            node = node.left;
        }
        //一直到左边节点没有，回到根节点,这时候根节点肯定有值
        node = stack.pop();

        //这时候要继续找右边的节点
        node = node.right;
    }


}