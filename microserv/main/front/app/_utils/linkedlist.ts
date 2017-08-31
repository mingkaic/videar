export class LinkedNode<T> {
	next: LinkedNode<T>;
	prev: LinkedNode<T>;

	constructor(public value: T, prev: LinkedNode<T> = null) {
		this.next = null;
		this.prev = prev;
	}
}

export class LinkedList<T>{
	head: LinkedNode<T>;
	tail: LinkedNode<T>;
	length = 0;

	constructor() {
		this.head = this.tail = null;
    };
	
	toArray(): T[] {
		let result = [];
		for (let it = this.head; it !== null; it = it.next) {
			result.push(it.value);
		}

		return result;
	};

	push_back(value: T) {
		let last = new LinkedNode<T>(value, this.tail);

		// invariant: if below condition, then this.head === null && this.tail === null
		if (this.head === null || this.tail === null) {
			this.head = last;
		}
		else {
			this.tail.next = last;
		}
		this.tail = last;
		length++;
	};

	push_front(value: T) {
		let first = new LinkedNode<T>(value);
		first.next = this.head;

		if (this.head === null || this.tail === null) {
			this.tail = first;
		}
		else {
			this.head.prev = first;
		}
		this.head = first;
		length++;
	};

	pop_back(): T {
		let last = this.tail;

		this.tail = last.prev;
		if (this.head === last) {
			this.head = null;
		}
		length--;

		return last.value; 
	};

	pop_front(): T {
		let first = this.head;

		this.head = first.next;
		if (this.tail === first) {
			this.tail = null;
		}
		length--;

		return first.value;
	};
	
	get_back(): T {
		if (this.tail) {
			return this.tail.value;
		}
		return null;
	};

	get_front(): T {
		if (this.head) {
			return this.head.value;
		}
		return null;
	};

	// remove node from its respective list and put as tail of this list
	stealBack(node: LinkedNode<T>) {
		if (null === node) {
			throw "cannot steal null node";
		}
		if (this.tail === node) {
			return;
		}
		if (null === node.prev) {
			if (this.head !== node) {
				throw "cannot steal head of another list";
			}
			this.head = node.next;
		}
		else {
			node.prev.next = node.next;
		}
		if (null === node.next) {
			throw "cannot steal tail of another list";
		}
		else {
			node.next.prev = node.prev;
		}
		// put back
		node.next = null;
		node.prev = this.tail;
		this.tail.next = node;
		this.tail = node;
	};
}