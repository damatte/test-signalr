import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

interface Message {
  user: string,
  messageContent: string
}

interface ToastMessage{
  severity: string,
  summary: string,
  detail: string,
  life: number,
  key: string,
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ToastModule, ButtonModule, RippleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService],
})
export class AppComponent implements OnInit{
  private connection: HubConnection;
  messages: Message[] = []
  token = ""; // <-- poner token

  constructor(private messageService: MessageService) {
    this.connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Trace)
      .withUrl('https://localhost:7090/hub/sica', {
        accessTokenFactory: () => this.token
      })
      .build();

    this.connection.on("ReceiveMessage", message => this.newMessage(message));

    this.connection.on("SendToastMessageToUser", toast => {
      console.log(toast)
      this.show(toast)
    })
  }

  ngOnInit(): void {
    this.connection.start()
      .then(_ => console.log("Connection Started"))
      .catch(error => console.error(error))
  }

  public newMessage(message: Message){
    console.log(message)
    this.messages.push(message);
  }

  public stop(){
    this.connection.stop();
  }

  public lock(){
    this.connection.send("lockuser", 2710698,310649,252);
  }

  public unlock(){
    this.connection.send("unlockuser", 2710698,252);
  }

  public show(message: ToastMessage){
    this.messageService.add(message)
  }
}
