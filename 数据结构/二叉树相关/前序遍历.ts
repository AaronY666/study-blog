
class Tree {
    public root;
    constructor() {
        this.root = null;
    }
    public insert(data) {
        var node = new BinaryTreeNode(data);
        if (!this.root) {
            this.root = node;
            return;
        }
        var current = this.root;
        var parent = null;
        while (current) {
            parent = current;
            if (data < parent.data) {
                current = current.left;
                if (!current) {
                    parent.left = node;
                    return;
                }
            } else {
                current = current.right;
                if (!current) {
                    parent.right = node;
                    return;
                }
            }

        }
    }
}

class BinaryTreeNode {
    public value = null;
    public left: BinaryTreeNode = null;
    public right: BinaryTreeNode = null;
    constructor(value) {
        this.value = value;
    }
}




//递归做法，前序输出的结果是中前后
function preTraversal(root) {
    if (!root) {
        return;
    }
    console.log(root.value);
    preTraversal(root.left);
    preTraversal(root.right);
}