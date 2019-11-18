import React, { MouseEvent } from 'react';
import domid from 'qj/domid';
import Portal from './Portal';
import focusElm from 'qj/focusElm';

const defaultTexts = {
	closeButton: 'Close',
	closeButtonLabel: 'Close this window',
};

export interface Props {
	bem?: string;
	closeDelay?: number;
	open?: boolean;
	startOpen?: boolean;
	modifier?: string;
	onClosed: () => void;
	flexible?: boolean;
	bodyWrap?: boolean;
	texts?: {
		closeButton: string;
		closeButtonLabel?: string;
	};
}

interface S {
	open: boolean;
	domid: string;
}

class Modal extends React.Component<Props, S> {
	static defaultProps = {
		// bem: 'Modal',
		// closeDelay: 1000,
		open: true,
		// startOpen: false,
		// modifier: '',
		// onClosed: () => {};
		// flexible: false,
	};

	modalElm?: HTMLElement | null;

	constructor(props: Props) {
		super(props);

		this.close = this.close.bind(this);
		this.closeModalOnCurtainClick = this.closeModalOnCurtainClick.bind(this);
		this.closeModalOnEsc = this.closeModalOnEsc.bind(this);

		this.state = {
			open: !!props.startOpen,
			domid: 'Modal',
		};
	}

	componentDidMount() {
		this.setState({ domid: this.state.domid + domid() });
		document.addEventListener('keydown', this.closeModalOnEsc);
		if (this.props.open) {
			this.open();
		}
	}
	componentDidUpdate(oldProps: Props) {
		const open = this.props.open;
		if (open !== oldProps.open) {
			if (open) {
				this.close();
			} else {
				this.open();
			}
		}
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.closeModalOnEsc);
		document.documentElement.classList.remove('modal-open');
	}

	open() {
		if (!this.state.open) {
			setTimeout(() => {
				this.setState({ open: true });
				document.documentElement.classList.add('modal-open');
				if (this.modalElm) {
					// @ts-ignore  (awaiting qj bugfix)
					focusElm(this.modalElm);
				}
			}, 100);
		}
	}
	close() {
		if (this.state.open) {
			this.setState({ open: false });
			document.documentElement.classList.remove('modal-open');
			if (this.props.onClosed) {
				setTimeout(() => {
					this.props.onClosed();
				}, this.props.closeDelay || 1000);
			}
		}
	}
	closeModalOnCurtainClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			this.close();
		}
	}
	closeModalOnEsc(e: KeyboardEvent) {
		if (e.which === 27) {
			this.close();
		}
	}

	render() {
		const props = this.props;
		const open = this.state.open;
		const domid = this.state.domid;
		const bem = props.bem || 'Modal';
		const modifierClass = props.modifier ? ' ' + bem + '--' + props.modifier : '';
		const flexibleClass = props.flexible ? ' ' + bem + '--flexible' : '';

		const t = props.texts || defaultTexts;
		const { closeButton, closeButtonLabel = t.closeButton } = t;

		return (
			<Portal>
				<div
					className={bem + 'wrapper'}
					hidden={!open}
					role="dialog"
					onClick={this.closeModalOnCurtainClick}
					id={domid}
				>
					<div
						className={bem + modifierClass + flexibleClass}
						ref={(elm) => {
							this.modalElm = elm;
						}}
					>
						{props.bodyWrap ? (
							<div className={bem + '__body'}>{props.children}</div>
						) : (
							props.children
						)}
						<button
							className={bem + '__closebutton'}
							type="button"
							onClick={this.close}
							aria-label={closeButtonLabel}
							aria-controls={domid}
							title={closeButtonLabel}
						>
							{closeButton}
						</button>
					</div>
				</div>
			</Portal>
		);
	}
}

export default Modal;
