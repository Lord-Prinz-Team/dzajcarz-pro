import { QueryType } from "discord-player";
import { ICommand } from "wokcommands";

const play = {
	category: "music",
	description: "Plays music.",
	slash: "both",
	testOnly: true,
	aliases: ["p"],

	expectedArgs: "<song_name>",

	options: [
		{
			name: "song_name",
			description: `Track you want to play.`,
			type: "STRING",
			required: true,
		},
	],

	callback: async ({ args, user, member, channel, guild, client }) => {
		if (!member.voice.channelId) {
			return "You are not on the voice channel.";
		}

		const voiceChannel = member.voice.channel!;

		const song = args[0];
		if (!song) {
			return "Please enter a song name or URL to this song.";
		}

		const discordPlayer = (globalThis as any).player;

		const response = await discordPlayer.search(args.join(" "), {
			requestedBy: member,
			searchEngine: QueryType.AUTO,
		});

		if (!response || !response.tracks.length) {
			return "No resuluts found :(";
		}

		if (!guild) {
			return "You can not use this command outside of the guild.";
		}

		const queue = await discordPlayer.createQueue(guild, {
			metadata: channel,
		});

		try {
			if (!queue.connection) await queue.connect(voiceChannel);
		} catch {
			await discordPlayer.deleteQueue(guild?.id);
			if (user) {
				return `I can't join the voice channel <@${user.id}>!`;
			}
			return "Something went wrong!";
		}

		if (channel) {
			await channel.send(
				`Loading your ${response.playlist ? "playlist" : "track"}...`
			);
		}

		response.playlist
			? queue.addTracks(response.tracks)
			: queue.addTrack(response.tracks[0]);

		if (!queue.playing) await queue.play();

		channel?.send("As you wish! <3");
	},
} as ICommand;

export default play;
