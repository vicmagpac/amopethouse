<?php

namespace App\Notifications;

use App\Models\Reserva;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservaConfirmada extends Notification
{
    use Queueable;

    public function __construct(private readonly Reserva $reserva) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $reserva = $this->reserva->loadMissing(['tipoServico', 'animais']);
        $pets = $reserva->animais->pluck('nome')->join(', ');

        return (new MailMessage)
            ->subject('Reserva confirmada na Amo Pet House')
            ->greeting('Olá, '.$notifiable->nome.'!')
            ->line('Sua reserva foi confirmada.')
            ->line('Serviço: '.$reserva->tipoServico?->nome)
            ->line('Pets: '.$pets)
            ->line('Início: '.$reserva->inicio?->timezone(config('app.timezone'))->format('d/m/Y H:i'))
            ->line('Valor: R$ '.number_format((float) $reserva->valor_total, 2, ',', '.'))
            ->line('O pagamento é feito no checkout presencial, quando o pet entra ou sai do cuidado.')
            ->line('Qualquer dúvida: WhatsApp (85) 99203-0506.');
    }
}
