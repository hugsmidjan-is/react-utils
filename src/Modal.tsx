/** @jsx createElement */
import { createElement, Component, MouseEvent, Fragment, ReactNode } from 'react';
import domid from '@hugsmidjan/qj/domid';
import Portal from './Portal';
import focusElm from '@hugsmidjan/qj/focusElm';
import getBemClass from './utils/getBemClass';
import { BemProps } from './types';

const win = window as { $$modalStack?: Array<Modal> } & Window & typeof globalThis;
const modalStack = win && (win.$$modalStack || (win.$$modalStack = []));

const modalOpenClass = 'modal-open';

const defaultTexts = {
	closeButton: 'Close',
	closeButtonLabel: 'Close this window',
};

/**@deprecated  Use `ModalProps` instead.  (Will be removed in v0.5) */
export type Props = ModalProps;

export type ModalProps = {
	/**
	 * The transition delay until closing the modal triggers `onClosed()`
	 *
	 * Default: `1000`
	 */
	closeDelay?: number;

	/**
	 * Indicates if teh Modal should be open or closed. To trigger opening or closing, simply flip this flag.
	 *
	 * Default: `true`
	 */
	open?: boolean;

	/**
	 * Set this to `true` for Modals that should render as if they always existed and had already been opened.
	 *
	 * A Modal that "starts open" will not CSS transition in, and will not trigger its `onOpen` callback on mount.
	 *
	 * Default: `false`
	 */
	startOpen?: boolean;

	/**
	 * Fickle modals close on ESC and outside clicks
	 *
	 * Default: `true`
	 */
	fickle?: boolean;

	/** Convenience callback that runs as soon as the `open` flag flips to `true` – including on initial opening.
	 *
	 * However, the initial `onOpen` is skipped  `startOpen` is set to `true`.
	 */
	onOpen?: () => void;

	/**
	 * Convenience callback that runs as soon as the `open` flag flips to `false`
	 */
	onClose?: () => void;

	/**
	 * Callback that runs when the modal close – **after** `closeDelay` has elaped.
	 */
	onClosed: () => void;

	/**
	 * Wrap the Modal's `children` in a `*__body` div container.
	 *
	 * Default: `false`
	 */
	bodyWrap?: boolean;

	/**
	 * Default:
	 * ```
	 * {
	 *   closeButton: 'Close',
	 *   closeButtonLabel: 'Close this window',
	 * }
	 * ```
	 */
	texts?: Readonly<{
		closeButton: string;
		closeButtonLabel?: string;
	}>;

	/**
	 * Should the modal be mounted in a Portal component `<div/>`
	 * located outside the ReactDOM.render root element?
	 *
	 * Default: `true`
	 */
	portal?: boolean;
} & (
	| {
			/** Render function that receives a `closeModal` action dispatcher. */
			render: (props: { closeModal(): void }) => ReactNode;
			children?: never;
	  }
	| { render?: never; children: ReactNode }
) &
	BemProps;

interface S {
	open: boolean;
	domid: string;
}

class Modal extends Component<ModalProps, S> {
	static defaultProps = {
		// bem: 'Modal',
		closeDelay: 1000,
		open: true,
		// startOpen: false,
		// modifier: '',
		// onClosed: () => {};
		portal: true,
	};

	modalElm?: HTMLElement | null;

	constructor(props: ModalProps) {
		super(props);

		this.close = this.close.bind(this);
		this.closeModalOnCurtainClick = this.closeModalOnCurtainClick.bind(this);
		this.closeModalOnEsc = this.closeModalOnEsc.bind(this);

		this.state = {
			open: !!props.startOpen && props.open !== false,
			domid: 'Modal',
		};
	}

	componentDidMount() {
		this.setState({ domid: this.state.domid + domid() });
		document.addEventListener('keydown', this.closeModalOnEsc);
		if (this.props.open || this.state.open) {
			this.open();
		}
	}
	componentDidUpdate(oldProps: ModalProps) {
		const open = this.props.open;
		if (open !== oldProps.open) {
			if (open) {
				this.open();
			} else {
				this.close();
			}
		}
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.closeModalOnEsc);
		modalStack.shift();
		document.documentElement.classList.remove(modalOpenClass);
	}

	open() {
		document.documentElement.classList.add(modalOpenClass); // Always set this, even on startOpen === true
		modalStack.unshift(this);
		if (!this.state.open) {
			setTimeout(() => {
				this.setState({ open: true });
				this.props.onOpen && this.props.onOpen();
				if (this.modalElm) {
					focusElm(this.modalElm);
				}
			}, 100);
		}
	}
	close() {
		if (this.state.open) {
			this.setState({ open: false });
			const stackPos = modalStack.indexOf(this);
			if (stackPos > -1) {
				modalStack.splice(stackPos, 1);
			}
			if (modalStack.length <= 0) {
				document.documentElement.classList.remove(modalOpenClass);
			}
			this.props.onClose && this.props.onClose();
			if (this.props.onClosed) {
				setTimeout(() => {
					this.props.onClosed();
				}, this.props.closeDelay);
			}
		}
	}
	closeModalOnCurtainClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			this.close();
		}
	}
	closeModalOnEsc(e: KeyboardEvent) {
		if (modalStack[0] === this && this.props.fickle !== false && e.key === 'Esc') {
			this.close();
		}
	}

	render() {
		const props = this.props;
		const open = this.state.open;
		const domid = this.state.domid;
		const bem = props.bem || 'Modal';
		const fickle = props.fickle !== false || undefined;

		const t = props.texts || defaultTexts;
		const { closeButton, closeButtonLabel = t.closeButton } = t;

		const Wrapper = props.portal ? Portal : Fragment;

		const contents = props.render
			? props.render({ closeModal: () => this.close() })
			: props.children;

		return (
			<Wrapper>
				<div
					className={getBemClass(bem + 'wrapper', props.modifier)}
					hidden={!open}
					role="dialog"
					onClick={fickle && this.closeModalOnCurtainClick}
					id={domid}
				>
					<div
						className={getBemClass(bem, props.modifier)}
						ref={(elm) => {
							this.modalElm = elm;
						}}
					>
						{props.bodyWrap ? <div className={bem + '__body'}>{contents}</div> : contents}
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
			</Wrapper>
		);
	}
}

export default Modal;
