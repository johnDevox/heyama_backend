import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // Émet un événement socket 'object:created' avec l'objet créé
  emitObjectCreated(object: any) {
    this.server.emit('object:created', object);
  }

  // Émet un événement socket 'object:deleted' avec l'ID de l'objet supprimé
  emitObjectDeleted(id: string) {
    this.server.emit('object:deleted', { id });
  }
}
