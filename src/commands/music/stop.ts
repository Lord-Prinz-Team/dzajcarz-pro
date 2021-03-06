import { ICommand } from "wokcommands";

const stop = {
	category: "music",
	description: "Disconectss bot.",
	slash: "both",
	aliases: ["dc"],

	callback: async ({ guild, user, member, client }) => {
		if (!guild) {
			return "You can not use this command outside of the guild.";
		}

		if (!member.voice.channelId) {
			return "You are not on the voice channel.";
		}

		const discordPlayer = (globalThis as any).player;

		const queue = discordPlayer?.getQueue(guild?.id);

		if (!queue || !queue.playing) {
			return `No music currently playing <@${user.id}>`;
		}
		queue.destroy();

		return `Music stopped into this server, see you next time `;
	},
} as ICommand;

export default stop;
