module.exports = {
  name: 'unmute',
  description: 'Réactive le bot dans le groupe.',
  async execute({ sock, msg, db, saveDB, sendReply }) {
    const jid = msg.key.remoteJid;

    // Vérifie si c'est un groupe
    if (!jid.endsWith('@g.us')) {
      return sendReply(sock, msg, '❌ Cette commande ne peut être utilisée que dans un groupe.');
    }

    // Récupère le nom du groupe
    const groupMetadata = await sock.groupMetadata(jid);
    const groupName = groupMetadata.subject || 'Groupe';

    // Récupère l’ID de l’utilisateur
    const sender = msg.key.participant || msg.key.remoteJid;
    const tagUser = sender.split('@')[0];

    // Désactive le mode mute
    db[jid] = db[jid] || {};
    db[jid].muted = false;
    saveDB();

    // Message de retour
    const text = `🔊 *Bot réactivé !*\n\n👤 *Par:* @${tagUser}\n👥 *Groupe:* *${groupName}*`;

    await sock.sendMessage(jid, { text, mentions: [sender] });
  }
};
