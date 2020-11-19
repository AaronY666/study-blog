
function middleTraversal(node) {
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

        //这时候相当于输出中节点，看看右节点存不存在
        console.log(node);
        node = node.right;

        //重复前一轮操作看看
    }


}