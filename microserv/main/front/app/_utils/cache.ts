import { LinkedList, LinkedNode } from './linkedlist';

class KTPair<K, T> {
	constructor(public key: K, public value: T) {
		this.key = key;
		this.value = value;
	};
}

// todo: test
export class Cache<K, T> {
	private list: LinkedList<KTPair<K, T>>;
	private map: Map<K, LinkedNode<KTPair<K, T>>>;

	constructor(public limit: number) {
		this.list = new LinkedList<KTPair<K, T>>();
		this.map = new Map();
	};
	
	toArray(): T[] {
		return this.list.toArray().map((pair: KTPair<K, T>) => pair.value);
	};

	changeLimit(limit: number) {
		this.limit = limit;
	};

	set(key: K, value: T) {
		if (this.has(key)) {
			// update
			this.update(key);
			this.list.tail.value.value = value;
			return;
		}
		if (this.list.length >= this.limit) {
			// dequeue
			this.remove();
		}
		// enqueue
		let pair = new KTPair(key, value);
		this.list.push_back(pair);
		this.map.set(key, this.list.tail);
	};

	get(key: K): T {
		if (!this.has(key)) {
			return null;
		}
		// update
		this.update(key);
		return this.map.get(key).value.value;
	};

	has(key: K) {
		return this.map.has(key);
	};

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