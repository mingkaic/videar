import * as _ from 'underscore';

export class ModalService {
	private activeModals: any[] = [];

	add(modal: any) {
		this.activeModals.push(modal);
	};

	remove(id: string) {
		let modalToRemove = _.findWhere(this.activeModals, { id: id });
		this.activeModals = _.without(this.activeModals, modalToRemove);
	};

	open(id: string) {
		// open modal specified by id
		let modal = _.findWhere(this.activeModals, { id: id });
		modal.open();
	};

	close(id: string) {
		// close modal specified by id
		let modal = _.find(this.activeModals, { id: id });
		modal.close();
	};
}
