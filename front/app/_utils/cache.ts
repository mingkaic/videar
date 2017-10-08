import { LinkedList, LinkedNode } from './linkedlist';

class KTPair<K, T> {
	constructor(public key: K, public value: T) {
		this.key = key;
		this.value = value;
	};
}

class OrderedNode<T> {
	constructor(public value: T, public idx: number) {}
}

// todo: test
export class Cache<K, T> {
	private list: LinkedList<KTPair<K, OrderedNode<T>>>;
	private map: Map<K, LinkedNode<KTPair<K, OrderedNode<T>>>>;
	private counter: number = 0;

	constructor(public limit: number) {
		this.list = new LinkedList<KTPair<K, OrderedNode<T>>>();
		this.map = new Map();
	};

	toArray(): T[] {
		return this.list.toArray()
		.sort((left, right) => {
			return left.value.idx - right.value.idx;
		})
		.map((pair: KTPair<K, OrderedNode<T>>) => {
			return pair.value.value;
		});
	};

	changeLimit(limit: number) {
		this.limit = limit;
	};

	set(key: K, value: T) {
		if (this.has(key)) {
			// update
			this.update(key);
			this.list.tail.value.value.value = value;
			return;
		}
		if (this.list.length >= this.limit) {
			// dequeue
			this.remove();
		}
		// enqueue
		let pair = new KTPair(key, 
			new OrderedNode<T>(value, this.counter++));
		this.list.push_back(pair);
		this.map.set(key, this.list.tail);
	};

	get(key: K): T {
		if (!this.has(key)) {
			return null;
		}
		// update
		this.update(key);
		return this.map.get(key).value.value.value;
	};

	has(key: K) {
		return this.map.has(key);
	};

	delete(key: K) {
		// move linked node from center to end of list, then dequeue
		this.list.stealBack(this.map.get(key));
		this.list.pop_back();
		this.map.delete(key);
	}

	private remove() {
		let key = this.list.head.value.key;
		this.map.delete(key);
		this.list.pop_front();
	};

	private update(key: K) {
		let it = this.map.get(key);
		this.list.stealBack(it);
	};
}
