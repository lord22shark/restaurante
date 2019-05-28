import React, {Component} from 'react';
import {Badge, Card, CardItem, Container, Content, Header, Input, Left, Body, Right, Button, Icon, Title, Tab, Tabs, Text, Thumbnail} from 'native-base';
import {Alert, Platform, FlatList, StyleSheet, ScrollView, TouchableHighlight, View} from 'react-native';
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
		borderColor: '#E3E3E3',
		borderRadius: 10,
		borderWidth: StyleSheet.hairlineWidth,
		flexDirection: 'column',
		justifyContent: 'center',
		margin: 10,
		padding: 10
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
			name: 'j',
			item: 'j',
			price: '10',
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
					value: null
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

		let orders = this.scope.state.orders;

		orders = orders.splice(this.index, 1);

		this.setState({
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

			return previous + current.price;

		}, 0.0);

		return `TOTAL: ${this.format(price)}`;

	}

	/**
	 *
	 */
	renderTotalWithTaxes () {

		const price = this.state.orders.reduce((previous, current) => {

			return previous + current.price;

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
				<Thumbnail small source={{uri: `data:image/png;base64,${user.image}`}} style={selectionStyle} />
			);

		} else {

			selectionStyle['backgroundColor'] = '#CCCCCC';

			return (
				<Badge style={selectionStyle}>
					<Text>{user.letters}</Text>
				</Badge>
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

						return (current.by.name === user.name) ? (previous + current.price) : previous;

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
	renderItem (item, index) {

		const order = item.item;

		return (
			<View key={`order-${index}`} style={[Styles.row, {borderBottomWidth: StyleSheet.hairlineWidth, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#D3D3D3', padding: 3}]}>
				<Text style={Styles.item}>{order.item}</Text>
				<View style={Styles.dashes} />
				<Text style={Styles.price}>{`${this.format(order.price)} / ${this.format(order.price * 1.1)}`}</Text>
				<TouchableHighlight onPress={this.onRemoveItemHandler.bind({scope: this, index})} style={{margin: 5}}>
					<Badge danger>
						<Icon name='md-remove' style={{color: 'white'}} />
					</Badge>
				</TouchableHighlight>
			</View>
		);

	}

	/**
	 *
	 */
	renderItemThumbnail (item, index) {

		const order = item.item;

		return (
			<View key={`order-${index}`}  style={[Styles.row, {borderBottomWidth: StyleSheet.hairlineWidth, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#D3D3D3', padding: 3}]}>
				<Text style={Styles.item}>{order.item}</Text>
				<View style={Styles.dashes} />
				<Text style={Styles.price}>{`${this.format(order.price)} / ${this.format(order.price * 1.1)}`}</Text>
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
				<ScrollView horizontal>
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
					<Text style={Styles.label}>Demonstrativo:</Text>
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
				<Tabs scrollWithoutAnimation>
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
