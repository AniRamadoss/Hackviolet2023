const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
} = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { witaiToken, mongoPassword } = require("../config.json");
const Transcriber = require("../transcriber");
const {MongoClient} = require('mongodb');

const mongoKey = "mongodb+srv://aniramadoss:" + mongoPassword + "@cluster0.tlqxqmi.mongodb.net/?retryWrites=true&w=majority"

const transcriber = new Transcriber(witaiToken);

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
				});
		});

		await interaction.reply(
			"Joined voice chat! Keeping an eye out for misogyny."
		);
	},
};
