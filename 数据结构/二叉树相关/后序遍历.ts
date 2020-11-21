
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

    let stack = [], last = null;
    while (node || stack.length) {
        while (node) {
            stack.push(node);
            node = node.left;
        }
        //一直到左边节点没有，回到根节点,这时候根节点肯定有值，不急着出栈
        node = stack[stack.length - 1];

        //如果右子树父节点被遍历过了，或者为空，那么就说明左右都遍历完了，可以输出中节点并弹栈
        if (node.right === last || !node.right) {
            //开始弹栈
            node = stack.pop();
            //输出中节点
            console.log(node.value);

            //为了避免重复向右查找，更新last
            last = node;

            //为了避免重复向左查找，把节点设为null,这样就不会向左查找了
            node = null;


        } else {
            //否则的话要继续找右边的节点
            node = node.right;
        }

    }




}