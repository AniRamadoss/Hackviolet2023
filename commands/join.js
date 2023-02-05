const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
} = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { witaiToken, mongoPassword } = require("../config.json");
const Transcriber = require("../transcriber");
const { MongoClient, ServerApiVersion } = require("mongodb");

const mongoKey =
	"mongodb+srv://aniramadoss:" +
	mongoPassword +
	"@cluster0.tlqxqmi.mongodb.net/?retryWrites=true&w=majority";

const transcriber = new Transcriber(witaiToken);
const client = new MongoClient(mongoKey, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});
client.connect();
const database = client.db("hackviolet2023");
const collection = database.collection("banned_words");
const id = "1071491195571802182";

// create a document to insert

// result.forEach(console.dir);
let banned_words = [];
module.exports = {
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("Joins the voice channel!"),
	async execute(interaction) {
		let channel = interaction.member.guild.channels.cache.get(
			interaction.member.voice.channel.id
		);
		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
			selfDeaf: false,
			selfMute: false,
		});
		const doc = {
			serverID: "1234567",
		};
		const result = await collection.findOne(doc);
		banned_words = (result.banned_words.split(',')).map(str => str.trim());
		console.log(banned_words);
		connection.receiver.speaking.on("start", (userId) => {
			transcriber
				.listen(
					connection.receiver,
					userId,
					interaction.client.users.cache.get(userId)
				)
				.then((data) => {
					if (!data.transcript.text) return;
					let text = data.transcript.text;
					let user = data.user;

					console.log("user: " + user + " said: " + text);

					if (banned_words.some(word => text.contains(word))) {
						// ban user
					}
					else {
						// call ML endpoint
					}
				});
		});

		await interaction.reply(
			"Joined voice chat! Keeping an eye out for misogyny."
		);
	},
};
