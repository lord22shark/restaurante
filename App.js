import React, {Component} from 'react';
import {Badge, Card, CardItem, Container, Content, Header, Input, Left, Body, Right, Button, Icon, Title, Tab, Tabs, Text, Thumbnail} from 'native-base';
import {Alert, Platform, FlatList, Image, StyleSheet, ScrollView, TouchableHighlight, View} from 'react-native';
import {RNCamera} from 'react-native-camera';

const CurrencyFormatter = require('currency-formatter');

const Styles = StyleSheet.create({

	content: {
		padding: 10
	},

	label: {
		color: '#909090',
		fontWeight: 'bold'
	},

	row: {
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'nowrap',
		justifyContent: 'space-between'
	},

	icon: {
		color: '#101010',
		fontSize: 33,
		margin: 5
	},

	column: {
		flex: 1,
		margin: 5
	},

	total: {
		color: '#990000',
		fontSize: 12,
		fontWeight: 'bold',
		marginBottom: 5,
		marginTop: 5
	},

	dashes: {
		borderColor: '#E3E3E3',
		borderStyle: 'dashed',
		borderTopWidth: 1,
		flex: 1,
		margin: 5	
	},

	item: {
		color: '#101010',
		fontSize: 13,
		marginRight: 3
	},

	price: {
		color: '#D90000',
		fontSize: 13,
		marginRight: 3
	},

	perUser: {
		alignItems: 'center',
		borderColor: '#3F51B5',
		borderRadius: 10,
		borderWidth: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		margin: 10,
		padding: 10
	},

	thumbnail: {
		borderRadius: 20,
		height: 40,
		width: 40
	},

	letterBall: {
		alignItems: 'center',
		backgroundColor: '#CCCCCC',
		borderRadius: 20,
		flexDirection: 'column',
		height: 40,
		justifyContent: 'center',
		marginLeft: 10,
		marginRight: 10,
		width: 40
	},

	letter: {
		fontWeight: 'bold'
	},

	lineThrough: {
		textDecorationLine: 'line-through',
		textDecorationStyle: 'solid'
	}

});

const androidCameraPermissionOptions = {
	title: 'Câmera',
	message: 'Precisamos de permissão para utilizar sua câmera',
	buttonPositive: 'OK',
	buttonNegative: 'CANCELAR'
};

const androidRecordAudioPermissionOptions = {
	title: 'Gravação de Áudio',
	message: 'Precisamos de permissão para gravar áudio',
	buttonPositive: 'OK',
	buttonNegative: 'CANCELAR'
};

type Props = {};

/**
 *
 */
export default class App extends Component<Props> {

	/**
	 *
	 */
	constructor (props) {

		super(props);

		this.state = {
			name: null,
			item: null,
			price: null,
			users: [],
			orders: [],
			camera: false
		};

		this.camera = null;

	}

	/**
	 *
	 */
	componentWillMount () {

	}

	/**
	 *
	 */
	componentDidMount () {

	}

	/**
	 *
	 */
	componentWillUnmount () {

	}

	/**
	 *
	 */
	format (price) {

		//return price.toLocaleString("pt-BR", {style: "currency", currency: "BRL", minimumFractionDigits: 2});

		//return new Intl.NumberFormat('pt_BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2}).format(price);

		return CurrencyFormatter.format(price, {code: 'BRL'});

	}

	/**
	 * this = {scope: this, index: index}
	 */
	onToggleSelectedUserHandler () {

		const users = this.scope.state.users;

		users[this.index].selected = !users[this.index].selected;

		this.scope.setState({
			users
		});

	}

	/**
	 *
	 */
	onAddNameHandler () {

		this.onAddName(null);

	}

	/**
	 *
	 */
	onAddName (picture) {

		if (this.state.name) {

			let name = this.state.name.trim();

			const users = this.state.users;

			if (users.filter(user => user.name === name).length === 0) {

				if (name.indexOf(' ') !== -1) {

					name = name.replace(/\s{2,}/g, ' ');

					const parts = name.split(/\s/);

					users.push({
						name: name,
						letters: `${parts[0][0].toUpperCase()}${parts[parts.length - 1][0].toUpperCase()}`,
						image: picture,
						selected: false
					});

				} else {

					users.push({
						name: name,
						letters: name[0].toUpperCase(),
						image: picture,
						selected: false
					});

				}

				this.setState({
					users,
					name: null
				});

			} else {

				Alert.alert('OOPS', 'Esta pessoa já está na lista!');

			}

		} else {

			Alert.alert('OOPS', 'O nome é obrigatório!');

		}

	}

	/**
	 *
	 */
	onEnableCameraHandler () {

		this.setState({
			camera: true
		});

	}

	/**
	 *
	 */
	onAddItemHandler () {

		const users = this.state.users.filter(user => user.selected === true);

		if (users && (users.length > 0)) {

			if ((this.state.item) && (this.state.price) && (this.state.price > 0.0)) {

				const orders = this.state.orders;

				if (users.length === 1) {

					orders.push({
						price: parseFloat(this.state.price),
						item: this.state.item,
						deleted: false,
						by: users[0]
					});

				} else {

					const price = parseFloat(this.state.price) / users.length;

					for (let u = 0; u < users.length; u++) {

						orders.push({
							price,
							item: this.state.item,
							deleted: false,
							by: users[u]
						});

					}

				}

				this.setState({
					orders,
					item: null,
					price: null
				});

			} else {

				Alert.alert('OOPS', 'Item e Valor não devem ser vazios!');

			}

		} else {

			Alert.alert('OOPS', 'Selecione pelo menos um usuário!');

		}

	}

	/**
	 * this = {scope: this, index: index}
	 */
	onRemoveItemHandler () {

		const orders = this.scope.state.orders;

		orders[this.index].deleted = true;

		this.scope.setState({
			orders
		});

	}

	/**
	 *
	 */
	onChangeNameHandler (value) {

		this.setState({
			name: value
		});

	}

	/**
	 *
	 */
	onChangeItemHandler (value) {

		this.setState({
			item: value
		});

	}

	/**
	 *
	 */
	onChangePriceHandler (value) {

		this.setState({
			price: value
		});

	}

	/**
	 *
	 */
	async onTakePictureHandler () {

		if (this.camera) {

			const data = await this.camera.takePictureAsync({quality: 0.5, base64: true});

			this.onAddName(data.base64);

		} else {

			Alert.alert('OOPS', 'Tivemos algum problema na câmera...');

		}

		this.setState({
			camera: false
		});

	}

	/**
	 *
	 */
	renderTotal () {

		const price = this.state.orders.reduce((previous, current) => {

			return (current.deleted === false) ? previous + current.price : previous;

		}, 0.0);

		return `TOTAL: ${this.format(price)}`;

	}

	/**
	 *
	 */
	renderTotalWithTaxes () {

		const price = this.state.orders.reduce((previous, current) => {

			return (current.deleted === false) ? previous + current.price : previous;

		}, 0.0) * 1.1;

		return `TOTAL (10%): ${this.format(price)}`;

	}

	/**
	 *
	 */
	renderUser (user) {

		const selectionStyle = {borderWidth: 1, borderColor: (user.selected) ? 'green' : 'red'};
		
		if (user.image) {

			return (
				<Image source={{uri: `data:image/png;base64,${user.image}`}} style={[Styles.thumbnail, selectionStyle]} />
			);

		} else {

			return (
				<View style={[Styles.letterBall, selectionStyle]}>
					<Text style={Styles.letter}>{user.letters}</Text>
				</View>
			);

		}

	}

	/**
	 *
	 */
	renderUsers (withValues) {

		if ((this.state.users) && (this.state.users.length > 0)) {

			return this.state.users.map((user, index) => {

				if (withValues) {

					const price = this.state.orders.reduce((previous, current) => {

						return ((current.by.name === user.name) && (current.deleted === false)) ? (previous + current.price) : previous;

					}, 0.0);

					return (
						<TouchableHighlight key={user.name} onPress={this.onToggleSelectedUserHandler.bind({scope: this, index})}>
							<View style={Styles.perUser}>
								{this.renderUser(user)}
								<Text style={Styles.price}>{this.format(price)}</Text>
								<Text style={Styles.price}>{this.format(price * 1.1)}</Text>
							</View>
						</TouchableHighlight>
					);

				} else {

					return (
						<TouchableHighlight key={user.name} onPress={this.onToggleSelectedUserHandler.bind({scope: this, index})}>
							{this.renderUser(user)}
						</TouchableHighlight>
					);

				}

			});

		} else {

			return null;

		}

	}

	/**
	 *
	 */
	renderItem (item) {

		const order = item.item;

		return (
			<View key={`order-${item.index}`} style={[Styles.row, {borderBottomWidth: StyleSheet.hairlineWidth, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#D3D3D3', padding: 3}]}>
				<Text style={[Styles.item, (order.deleted ? Styles.lineThrough : null)]}>{order.item}</Text>
				<View style={Styles.dashes} />
				<Text style={[Styles.price, (order.deleted ? Styles.lineThrough : null)]}>{`${this.format(order.price)} / ${this.format(order.price * 1.1)}`}</Text>
				{order.deleted === false ? (
					<TouchableHighlight onPress={this.onRemoveItemHandler.bind({scope: this, index: item.index})} style={{margin: 5}}>
						<Badge danger style={{width: 15, height: 15}}>
							<Icon name='md-remove' style={{color: 'white', marginTop: -7.2}} />
						</Badge>
					</TouchableHighlight>
				) : null}
			</View>
		);

	}

	/**
	 *
	 */
	renderItemThumbnail (item) {

		const order = item.item;

		return (
			<View key={`order-${item.index}`}  style={[Styles.row, {borderBottomWidth: StyleSheet.hairlineWidth, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#D3D3D3', padding: 3}]}>
				<Text style={[Styles.item, (order.deleted ? Styles.lineThrough : null)]}>{order.item}</Text>
				<View style={Styles.dashes} />
				<Text style={[Styles.price, (order.deleted ? Styles.lineThrough : null)]}>{`${this.format(order.price)} / ${this.format(order.price * 1.1)}`}</Text>
				<Badge primary style={{margin: 5}}>
					<Text>{order.by.letters}</Text>
				</Badge>
			</View>
		);

	}

	/**
	 *
	 */
	getKeyExtractor (item, index) {

		return `order-${index}`;

	}

	/**
	 *
	 */
	renderUsersOrNone (withValues) {

		if ((this.state.users) && (this.state.users.length > 0)) {

			return (
				<ScrollView horizontal style={{flex: 1}}>
					{this.renderUsers(withValues)}
				</ScrollView>
			);

		} else {

			return (
				<Card>
					<CardItem>
						<Body>
							<Text style={{color: 'red'}}>Não tem ninguém nessa mesa?</Text>
						</Body>
					</CardItem>
				</Card>
			);

		}

	}
	
	/**
	 *
	 */
	renderResumo () {

		return (
			<Content style={Styles.content}>
				<Text style={Styles.label}>Pedidos:</Text>
				<FlatList extraData={this.state} data={this.state.orders} keyExtractor={this.getKeyExtractor.bind(this)} renderItem={this.renderItemThumbnail.bind(this)} style={{marginTop: 5, marginBottom: 5}} />
				<Text style={Styles.label}>Resumo por Pessoa:</Text>
				{this.renderUsersOrNone(true)}
			</Content>
		);

	}

	/**
	 *
	 */
	renderPrincipal () {

		if (this.state.camera === true) {

			return (
				<View style={{flex: 1, flexDirection: 'column', backgroundColor: 'black'}}>
					<RNCamera ref={ref => {this.camera = ref;}} style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}} type={RNCamera.Constants.Type.back} flashMode={RNCamera.Constants.FlashMode.off} androidCameraPermissionOptions={androidCameraPermissionOptions} androidRecordAudioPermissionOptions={androidRecordAudioPermissionOptions} />
					<View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
						<TouchableHighlight onPress={this.onTakePictureHandler.bind(this)} style={{flex: 0, backgroundColor: '#fff', borderRadius: 5, padding: 15, paddingHorizontal: 20, alignSelf: 'center', margin: 20}}>
							<Icon name='ios-camera' style={{color: 'red'}} />
						</TouchableHighlight>
						<TouchableHighlight onPress={() => { this.setState({camera: false}); }} style={{flex: 0, backgroundColor: '#fff', borderRadius: 5, padding: 15, paddingHorizontal: 20, alignSelf: 'center', margin: 20}}>
							<Icon name='md-remove' style={{color: 'red'}} />
						</TouchableHighlight>
					</View>
				</View>
			);

		} else {

			return (
				<Content style={Styles.content}>
					<View>
						<Text style={Styles.label}>Nome:</Text>
						<View style={Styles.row}>
							<Input bordered placeholder='Quem está na mesa?' onChangeText={this.onChangeNameHandler.bind(this)} value={this.state.name} />
							<Icon name='ios-checkmark-circle-outline' onPress={this.onAddNameHandler.bind(this)} style={[Styles.icon, {color: 'green'}]} />
							<Icon name='ios-camera' onPress={this.onEnableCameraHandler.bind(this)} style={[Styles.icon, {color: 'green'}]} />
						</View>
					</View>
					{this.renderUsersOrNone(false)}
					<View style={Styles.row}>
						<View style={Styles.column}>
							<Text style={Styles.label}>Item:</Text>
							<Input bordered placeholder='Item' onChangeText={this.onChangeItemHandler.bind(this)} value={this.state.item} />
						</View>
						<View style={Styles.column}>
							<Text style={Styles.label}>R$:</Text>
							<Input bordered placeholder='Preço' onChangeText={this.onChangePriceHandler.bind(this)} value={this.state.price} keyboardType='decimal-pad' />
						</View>
					</View>
					<Button block success onPress={this.onAddItemHandler.bind(this)}>
						<Text>Adicionar</Text>
					</Button>
					<View />
					<Text style={[Styles.label, {marginTop: 10, marginBottom: 10}]}>Demonstrativo:</Text>
					<FlatList extraData={this.state} data={this.state.orders} keyExtractor={this.getKeyExtractor.bind(this)} renderItem={this.renderItem.bind(this)} style={{marginTop: 5, marginBottom: 5}} />
					<View style={Styles.row}>
						<Text style={Styles.total}>{this.renderTotal()}</Text>
						<Text style={Styles.total}>{this.renderTotalWithTaxes()}</Text>
					</View>
				</Content>
			);

		}

	}
	
	/**
	 *
	 */
	render () {
	
		return (
			<Container>
				<Header hasTabs>
					<Body>
						<Title>Restaurante</Title>
					</Body>
				</Header>
				<Tabs scrollWithoutAnimation locked>
					<Tab heading="Principal">
						{this.renderPrincipal()}
					</Tab>
					<Tab heading="Resumo">
						{this.renderResumo()}
					</Tab>
				</Tabs>
			</Container>
		);
	
	}

}
