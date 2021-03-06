
function postTraversal(node) {
    if (!node) {
        return;
    }
    postTraversal(node.left);
    postTraversal(node.right);
    console.log(node.value);
}

function postTraversal2(node) {
    if (!node) {
        return;
    }

    let stack = [], last = null;
    while (node || stack.length) {
        while (node) {
            stack.push(node);
            node = node.left;
        }
        //一直到左边节点没有，回到根节点,这时候根节点肯定有值，不急着出栈，因为这个点还没被输出过
        node = stack[stack.length - 1];

        //如果右子树父节点被遍历过了||或者为空，那么就说明左右都遍历完了，可以输出中节点并弹栈
        if (node.right === last || !node.right) {
            //开始弹栈
            node = stack.pop();
            //输出中节点
            console.log(node.value);

            //last设置为当前节点，是为了从右边节点返回到父节点时，避免再次向右查找，所以同样的判断条件里也得加上node.right===last
            last = node;

            //node设置为null是为了相当于把这个点及其子节点数都屏蔽掉，当做空节点处理，这样就会返回父节点，并且去查找父节点的右节点
            node = null;

        } else {
            //否则的话要继续找右边的节点
            node = node.right;
        }

    }
}